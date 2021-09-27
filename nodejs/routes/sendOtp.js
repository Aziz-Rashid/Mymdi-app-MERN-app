const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
var express = require('express');
var router = express.Router();

router.post('/', async (req, res) => {
  const { value } = req.body;
  console.log(value)
  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  try {
    const data = await client.verify.services('VAa7adb36e95d7bdf027e8b4305d5fcc19')
      .verifications
      .create({ to: value, channel: 'sms' })
    res.send(JSON.stringify(data))
    return data
  } catch (err) {
    console.log(err)
  }
});


module.exports = router;
