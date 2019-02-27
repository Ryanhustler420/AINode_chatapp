const express = require ('express');

const router = express.Router ();

const UserCtrl = require ('../controllers/users');
const Whois = require ('../Helpers/Whois');

router.get ('/users', Whois.VerifyToken, UserCtrl.GetAllUsers);
router.get ('/users/:id', Whois.VerifyToken, UserCtrl.GetUser);
router.get ('/users/:username', Whois.VerifyToken, UserCtrl.GetUserByName);

module.exports = router;
