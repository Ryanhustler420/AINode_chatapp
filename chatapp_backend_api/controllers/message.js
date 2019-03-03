const HtppStatus = require ('http-status-codes');

const Message = require ('../models/messageModals');
const Conversation = require ('../models/coversationModals');
const User = require ('../models/userModal');

module.exports = {
  async SendMessage (req, res) {
    const {senderId, receiverId} = req.params;

    await Conversation.find (
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
          const newConversation = new Conversation ();
          newConversation.participant.push ({
            senderId: req.user._id,
            receiverId: req.params.receiverId,
          });

          const saveConversation = await newConversation.save ();

          // console.log (saveConversation);
          /**
           * { _id: 5c7b6e0909e6c15738efd58e, <--- _id conversation
                participant:
                [ { _id: 5c7b6e0909e6c15738efd58f,
                    senderId: 5c76ee113b95a76c48c1bc29,
                    receiverId: 5c76ee263b95a76c48c1bc2a } ],
                __v: 0 
              }
           */

          const newMessage = new Message ();
          newMessage.conversationId = saveConversation._id; // <-- _id conversation
          newMessage.sender = req.user.username;
          newMessage.receiver = req.body.receiverName;
          newMessage.message.push ({});
        }
      }
    );
  },
};
