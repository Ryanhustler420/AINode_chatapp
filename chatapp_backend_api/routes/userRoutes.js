const express = require ('express');

const router = express.Router ();

const UserCtrl = require ('../controllers/users');
const Whois = require ('../Helpers/Whois');

router.get ('/users', Whois.VerifyToken, UserCtrl.GetAllUsers);

module.exports = router;
