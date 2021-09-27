const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
var express = require('express');
var router = express.Router();

router.post('/verify', async (req, res) => {
    const { num, code } = req.body;
    res.set('Access-Control-Allow-Origin', '*');
    const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    let verificationResult;
    try {
        verificationResult = await client.verify.services('VAa7adb36e95d7bdf027e8b4305d5fcc19')
            .verificationChecks
            .create({ code, to: num });
    } catch (err) {
        console.log(err)
    }
    return res.send(verificationResult)
});

module.exports = router;
