const express = require('express');
const Agreement = require('../models/Agreement');
const { generateCIH } = require('../utils/hash');
const { createAgreementPDF } = require('../utils/pdfGenerator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create an agreement
router.post('/', authMiddleware, async (req, res) => {
    try {
        const agreement = new Agreement(req.body);
        agreement.status = 'Pending Verification';
        await agreement.save();
        res.status(201).json({ success: true, message: 'Agreement created', data: agreement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating agreement', errors: [error.message] });
    }
});

// Get all agreements related to a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const agreements = await Agreement.find({
            $or: [{ partyAEmail: userEmail }, { partyBEmail: userEmail }]
        }).sort({ createdAt: -1 });
        
        res.json({ success: true, message: 'Agreements fetched', data: agreements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching agreements', errors: [error.message] });
    }
});

// Get single agreement
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const agreement = await Agreement.findById(req.params.id);
        
        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Agreement not found', errors: null });
        }
        
        // Security check - only parties involved can view it
        if (agreement.partyAEmail !== userEmail && agreement.partyBEmail !== userEmail) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to agreement', errors: null });
        }

        res.json({ success: true, message: 'Agreement fetched', data: agreement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching agreement', errors: [error.message] });
    }
});

// Verify Face ID
router.post('/:id/verify', authMiddleware, async (req, res) => {
    try {
        const { party, hash } = req.body; 
        const agreement = await Agreement.findById(req.params.id);
        
        if (!agreement) return res.status(404).json({ success: false, message: 'Agreement not found' });
        
        if (agreement.status === 'Cancelled' || agreement.status === 'Disputed') {
             return res.status(400).json({ success: false, message: 'Cannot verify a cancelled or disputed agreement' });
        }

        const now = new Date();

        if (party === 'A') {
            agreement.partyAVerified = true;
            agreement.partyAVerifiedAt = now;
        }
        if (party === 'B') {
            agreement.partyBVerified = true;
            agreement.partyBVerifiedAt = now;
        }

        if (agreement.partyAVerified && agreement.partyBVerified) {
            agreement.status = 'Verified';
            agreement.cihHash = generateCIH({
                agreementId: agreement._id.toString(),
                agreementText: agreement.description,
                partyAHash: party === 'A' ? hash : 'dummyA', 
                partyBHash: party === 'B' ? hash : 'dummyB',
                timestamp: now.toISOString(),
                deviceFingerprint: req.headers['user-agent'] || 'unknown-device'
            });
        } else if (agreement.partyAVerified || agreement.partyBVerified) {
            agreement.status = 'Partially Verified';
        }

        await agreement.save();
        res.json({ success: true, message: `Verification successful for Party ${party}`, data: agreement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error verifying agreement', errors: [error.message] });
    }
});

// Update Status (Complete, Dispute, Cancel)
router.post('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status, reason } = req.body; // status: 'Completed', 'Disputed', 'Cancelled'
        const userEmail = req.user.email;
        const agreement = await Agreement.findById(req.params.id);
        
        if (!agreement) return res.status(404).json({ success: false, message: 'Agreement not found' });
        
        // Security check
        if (agreement.partyAEmail !== userEmail && agreement.partyBEmail !== userEmail) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (status === 'Cancelled' && agreement.status === 'Verified') {
            return res.status(400).json({ success: false, message: 'Cannot cancel a fully verified agreement. Raise a dispute instead.' });
        }

        agreement.status = status;
        await agreement.save();
        res.json({ success: true, message: `Agreement marked as ${status}`, data: agreement });
    } catch (error) {
         res.status(500).json({ success: false, message: 'Error updating agreement status', errors: [error.message] });
    }
});

// Download PDF Certificate
// Cannot use authMiddleware easily if accessed directly via browser tag `<a href="/api/...">`
// Using query parameter for token or we can just send standard fetch blob with Auth header
router.get('/:id/pdf', async (req, res) => {
    try {
        // Simple mock route for demo purposes if token auth isn't passed inline
        // Ideally pass ?token= and verify
        const agreement = await Agreement.findById(req.params.id);
        if (!agreement) return res.status(404).json({ error: 'Not found' });
        
        if (agreement.status !== 'Verified' && agreement.status !== 'Completed') {
              return res.status(400).json({ error: 'Certificate only available for Verified or Completed agreements' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=PACT_Agreement_${agreement._id}.pdf`);

        const doc = createAgreementPDF(agreement);
        doc.pipe(res);
        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
