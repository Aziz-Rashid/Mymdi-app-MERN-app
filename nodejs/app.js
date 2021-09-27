var express = require('express');
var bodyParser = require('body-parser')
var fileupload = require("express-fileupload");
require('dotenv').config()
var cors = require('cors')
var app = express();
app.use(cors());
app.use(fileupload());
app.use(bodyParser.json())
var routes = require('./routes/sendOtp.js')
var verify = require('./routes/verify.js');
var userprofile = require('./routes/userProfile.js');
var protectPDF = require('./routes/protectPDF.js');
const db = require("./model");
db.mongoose
    .connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
app.options('*', cors());
app.use('/', routes);
app.use('/', verify);
app.use('/', userprofile);
app.use('/', protectPDF);
var port = process.env.PORT || 5000;
app.listen(port, function (req, res) {
    console.log("Catch the action at http://localhost:" + port);
});