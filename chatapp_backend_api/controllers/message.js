const HtppStatus = require ('http-status-codes');

const Message = require ('../models/messageModals');
const Conversation = require ('../models/coversationModals');
const User = require ('../models/userModal');

module.exports = {
  SendMessage (req, res) {
    const {senderId, receiverId} = req.params;

    Conversation.find (
      {
        $or: [
          {
            participant: {
              $elemMatch: {senderId: senderId, receiverId: receiverId},
            },
          },
          {
            participant: {
              $elemMatch: {senderId: receiverId, receiverId: senderId},
            },
          },
        ],
      },
      async (err, result) => {
        if (result.length > 0) {
        } else {
        }
      }
    );
  },
};
