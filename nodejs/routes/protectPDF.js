var fs = require('fs');
var express = require('express');
var router = express.Router();

var protectPDF = require('../helpers/protect-pdf');

router.post("/protectPDF", async (req, res) => {
  await protectPDF.protectPDF(req.body.password, res, req.files.file.data, fs);
});

module.exports = router;
