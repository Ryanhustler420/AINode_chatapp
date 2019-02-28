const express = require ('express');
const router = express.Router ();

const FollowCtrl = require ('../controllers/follows');
const Whois = require ('../Helpers/Whois');

router.post ('/follow-user', Whois.VerifyToken, FollowCtrl.FollowUser);
router.post ('/unfollow-user', Whois.VerifyToken, FollowCtrl.UnFollowUser);
router.post ('/mark/:id', Whois.VerifyToken, FollowCtrl.MarkNotification);
router.post ('/delete/:id', Whois.VerifyToken, FollowCtrl.DeleteNotification);

module.exports = router;
