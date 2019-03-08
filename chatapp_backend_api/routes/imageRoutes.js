const express = require ('express');

const router = express.Router ();

const ImageCtrl = require ('../controllers/images');
const Whois = require ('../Helpers/Whois');

router.post ('/upload-image', Whois.VerifyToken, ImageCtrl.UploadImage);

module.exports = router;
