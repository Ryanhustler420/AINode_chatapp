const express = require ('express');

const router = express.Router ();

const ImageCtrl = require ('../controllers/images');
const Whois = require ('../Helpers/Whois');

router.post ('/upload-image', Whois.VerifyToken, ImageCtrl.UploadImage);
router.post (
  '/set-default-image',
  Whois.VerifyToken,
  ImageCtrl.SetDefaultImage
);

module.exports = router;
