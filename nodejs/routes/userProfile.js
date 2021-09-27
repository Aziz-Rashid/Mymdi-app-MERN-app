var express = require('express');
const db = require("../model");
const User = db.user;
var router = express.Router();
router.post('/userProfile', async (req, res) => {
    const { firstname, lastname, email, phone, wallet, username } = req.body.userInfo
    res.set('Access-Control-Allow-Origin', '*');
    const error = {}
    if (firstname == '' || lastname == '' || email == '' || phone == '' || wallet == '' || username == '') {
        return res.status(404).send({ message: "fill all fileds." });
    }

    const userdata = await User.findOne({ phone })
    if (userdata) {
        return res.status(404).send({ message: "User exist with phone ." });
    }
    const userwallet = await User.findOne({ wallet })
    if (userwallet) {
        return res.status(404).send({ message: "User exist with this wallet." });
    }

    const user = new User({
        firstname,
        lastname,
        email,
        phone,
        wallet,
        username
    })
    const getuserdata = await user.save()
    res.status(200).send({
        ...getuserdata._doc
      });

});
router.post('/getUserbyphone', async (req, res) => {
    const { phone } = req.body
    res.set('Access-Control-Allow-Origin', '*');
    const userdata = await User.findOne({ phone })
    if (!userdata) {
        return res.status(404).send({ message: "User Not with phone ." });
    }
    res.status(200).send({
        ...userdata._doc
      });
});
router.post('/getUserbywallet', async (req, res) => {
    const { wallet } = req.body
    res.set('Access-Control-Allow-Origin', '*');
    const userdata = await User.findOne({ wallet })
    if (!userdata) {
        return res.status(404).send({ message: "User Not with wallet ." });
    }
    res.status(200).send({
        ...userdata._doc
      });
});
router.put('/updateUser', async (req, res) => {
    const { data:{firstname,lastname,wallet,phone,email,username},id } = req.body
    res.set('Access-Control-Allow-Origin', '*');
    const userdata = await User.findByIdAndUpdate(id,{
        firstname,lastname,wallet,phone,email,username
    })
    if (!userdata) {
        return res.status(400).send({ message: "User Not Found ." });
    }
    res.status(200).send({
        ...userdata._doc
      });
});

module.exports = router;
