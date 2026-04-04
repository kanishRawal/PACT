const PDFDocument = require('pdfkit');
function createAgreementPDF(agreement) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Certificate Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#0A21C0');
       
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50)
       .lineWidth(1)
       .stroke('#0A21C0');

    // Header Title
    doc.moveDown(2);
    doc.fillColor('#0A21C0').fontSize(32).font('Helvetica-Bold').text('PACT', { align: 'center' });
    doc.fillColor('#666666').fontSize(10).font('Helvetica').text('Predictive AI-Backed Commitment Technology', { align: 'center', characterSpacing: 1 });
    doc.moveDown(1.5);

    // Decorative Line
    doc.moveTo(doc.page.width / 2 - 100, doc.y)
       .lineTo(doc.page.width / 2 + 100, doc.y)
       .lineWidth(1)
       .stroke('#E5E7EB');
    doc.moveDown(1.5);

    doc.fillColor('#111827').fontSize(24).font('Helvetica-Bold').text('Agreement Certificate', { align: 'center' });
    doc.moveDown(2);

    // Grid Layout for Metadata
    const leftCol = 70;
    const rightCol = doc.page.width / 2 + 10;
    let currentY = doc.y;

    doc.fontSize(14).font('Helvetica-Bold').fillColor('#374151').text('Agreement Details', leftCol, currentY);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#374151').text('Verification Status', rightCol, currentY);
    
    currentY += 25;
    
    // Details
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('TITLE', leftCol, currentY);
    doc.fontSize(11).font('Helvetica').fillColor('#111827').text(agreement.title, leftCol, currentY + 12);
    
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('STATUS', rightCol, currentY);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(agreement.status === 'verified' ? '#059669' : '#D97706').text(agreement.status.toUpperCase(), rightCol, currentY + 12);
    
    currentY += 40;
    
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('TYPE', leftCol, currentY);
    doc.fontSize(11).font('Helvetica').fillColor('#111827').text(agreement.agreementType.charAt(0).toUpperCase() + agreement.agreementType.slice(1), leftCol, currentY + 12);
    
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('DATE CREATED', rightCol, currentY);
    doc.fontSize(11).font('Helvetica').fillColor('#111827').text(new Date(agreement.createdAt).toLocaleDateString(), rightCol, currentY + 12);

    currentY += 40;

    if (agreement.amount || agreement.location || agreement.dueDate) {
        if (agreement.amount) {
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('AMOUNT', leftCol, currentY);
            doc.fontSize(11).font('Helvetica').fillColor('#111827').text(`$${agreement.amount}`, leftCol, currentY + 12);
        }
        if (agreement.location) {
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('LOCATION', rightCol, currentY);
            doc.fontSize(11).font('Helvetica').fillColor('#111827').text(agreement.location, rightCol, currentY + 12);
        }
        currentY += 40;
        if (agreement.dueDate) {
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('DUE DATE', leftCol, currentY);
            doc.fontSize(11).font('Helvetica').fillColor('#111827').text(new Date(agreement.dueDate).toLocaleDateString(), leftCol, currentY + 12);
            currentY += 40;
        }
    }

    // Description
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#6B7280').text('TERMS & DESCRIPTION', leftCol, currentY);
    doc.fontSize(11).font('Helvetica').fillColor('#111827').text(agreement.description, leftCol, currentY + 15, { width: doc.page.width - leftCol * 2, align: 'justify' });
    
    doc.moveDown(3);

    // Parties Involved Section
    currentY = doc.y;
    doc.rect(leftCol - 10, currentY, doc.page.width - (leftCol * 2) + 20, 110).fillAndStroke('#F3F4F6', '#E5E7EB');
    
    currentY += 15;
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#111827').text('Parties to the Agreement', leftCol, currentY, { align: 'center', width: doc.page.width - leftCol * 2 });
    currentY += 30;

    // Party A
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#111827').text(agreement.partyAName, leftCol, currentY);
    doc.fontSize(10).font('Helvetica').fillColor('#4B5563').text(agreement.partyAEmail, leftCol, currentY + 14);
    doc.fontSize(10).font('Helvetica-Bold').fillColor(agreement.partyAVerified ? '#059669' : '#DC2626').text(agreement.partyAVerified ? '✓ Biometrically Verified' : '✗ Unverified', leftCol, currentY + 28);

    // Party B
    const partyBX = rightCol - 20;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#111827').text(agreement.partyBName, partyBX, currentY);
    doc.fontSize(10).font('Helvetica').fillColor('#4B5563').text(agreement.partyBEmail, partyBX, currentY + 14);
    doc.fontSize(10).font('Helvetica-Bold').fillColor(agreement.partyBVerified ? '#059669' : '#DC2626').text(agreement.partyBVerified ? '✓ Biometrically Verified' : '✗ Unverified', partyBX, currentY + 28);

    currentY += 70;

    // CIH Hash Area
    currentY += 10;
    doc.rect(leftCol - 10, currentY, doc.page.width - (leftCol * 2) + 20, 100).fillAndStroke('#111827', '#111827');
    
    currentY += 15;
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#9CA3AF').text('VERIFICATION RECORD (AVID)', leftCol, currentY, { align: 'center', width: doc.page.width - leftCol * 2 });
    currentY += 20;
    
    if (agreement.cihHash) {
        doc.fontSize(8).font('Courier').fillColor('#10B981').text(`Verification ID: ${agreement.cihHash}`, leftCol, currentY, { align: 'center', width: doc.page.width - leftCol * 2 });
        currentY += 15;
        doc.fontSize(8).font('Courier').fillColor('#9CA3AF').text(`Device: ${agreement.deviceFingerprint || 'Verified Identity Context'}`, leftCol, currentY, { align: 'center', width: doc.page.width - leftCol * 2 });
        currentY += 15;
        doc.fontSize(8).font('Courier').fillColor('#9CA3AF').text(`Time: ${new Date(agreement.updatedAt).toUTCString()}`, leftCol, currentY, { align: 'center', width: doc.page.width - leftCol * 2 });
    } else {
        doc.fontSize(11).font('Helvetica').fillColor('#FCD34D').text('Pending Final Verification', leftCol, currentY, { align: 'center', width: doc.page.width - leftCol * 2 });
    }

    currentY += 60;

    // Footer
    doc.fontSize(12).font('Helvetica-Oblique').fillColor('#6B7280').text(
        'This agreement was digitally verified and permanently secured using PACT.', 
        leftCol, 
        doc.page.height - 90, 
        { align: 'center', width: doc.page.width - leftCol * 2 }
    );

    return doc;
}

module.exports = { createAgreementPDF };
