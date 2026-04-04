const crypto = require('crypto');

function generateCIH({ agreementId, agreementText, partyAHash, partyBHash, timestamp, deviceFingerprint }) {
    const dataString = `${agreementId}${agreementText}${partyAHash}${partyBHash}${timestamp}${deviceFingerprint}`;
    return crypto.createHash('sha256').update(dataString).digest('hex');
}

module.exports = { generateCIH };
