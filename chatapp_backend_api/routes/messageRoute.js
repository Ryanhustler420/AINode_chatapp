const express = require ('express');
const router = express.Router ();

const MessageCtrl = require ('../controllers/message');
const Whois = require ('../Helpers/Whois');

router.post (
  '/chat-messages/:senderId/:receiverId',
  Whois.VerifyToken,
  MessageCtrl.SendMessage
);

router.get (
  '/chat-messages/:senderId/:receiverId',
  Whois.VerifyToken,
  MessageCtrl.GetAllMessage
);

router.get (
  '/receiver-messages/:senderName/:receiverName',
  Whois.VerifyToken,
  MessageCtrl.MarkReceiverMessages
);

router.get (
  '/mark-all-messages',
  Whois.VerifyToken,
  MessageCtrl.MarkAllMessages
);

module.exports = router;
