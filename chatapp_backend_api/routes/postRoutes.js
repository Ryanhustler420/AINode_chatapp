const express = require ('express');
const router = express.Router ();

const PostCtrl = require ('../controllers/posts');
const Whois = require ('../Helpers/Whois');

router.post ('/post/add-post', Whois.VerifyToken, PostCtrl.AddPost);

module.exports = router;
