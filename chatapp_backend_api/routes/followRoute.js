const express = require ('express');
const router = express.Router ();

const FollowCtrl = require ('../controllers/follows');
const Whois = require ('../Helpers/Whois');

router.post ('/follow-user', Whois.VerifyToken, FollowCtrl.FollowUser);

module.exports = router;
