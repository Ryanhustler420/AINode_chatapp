const express = require ('express');

const router = express.Router ();

const UserCtrl = require ('../controllers/users');
const Whois = require ('../Helpers/Whois');

router.get ('/users', Whois.VerifyToken, UserCtrl.GetAllUsers);
router.get ('/users/:id', Whois.VerifyToken, UserCtrl.GetUser);
router.get ('/users_with/:username', Whois.VerifyToken, UserCtrl.GetUserByName);
router.get (
  '/user/view-profile/:id',
  Whois.VerifyToken,
  UserCtrl.SendViewProfileNotification
);
router.post ('/change-password', Whois.VerifyToken, UserCtrl.ChangePassword);

module.exports = router;
