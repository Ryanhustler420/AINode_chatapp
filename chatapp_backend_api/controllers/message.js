const HttpStatus = require ('http-status-codes');

const Message = require ('../models/messageModals');
const Conversation = require ('../models/coversationModals');
const User = require ('../models/userModal');
const Helper = require ('../Helpers/helpers');

module.exports = {
  async GetAllMessage (req, res) {
    const {senderId, receiverId} = req.params;

    const conversation = await Conversation.findOne ({
      $or: [
        {
          $and: [
            {'participant.senderId': senderId},
            {'participant.receiverId': receiverId},
          ],
        },
        {
          $and: [
            {'participant.senderId': receiverId},
            {'participant.receiverId': senderId},
          ],
        },
      ],
    }).select ('_id');

    if (conversation) {
      const messages = await Message.findOne ({
        conversationId: conversation._id,
      });

      res
        .status (HttpStatus.OK)
        .json ({message: 'Messages returned', messages});
    } else {
      // res.status (HttpStatus.NOT_FOUND).json ({message: 'Error occured'});
    }
  },
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
          // console.log (result);
          const msg = await Message.findOne ({conversationId: result[0]._id});

          Helper.updateChatList (req, msg);

          await Message.update (
            {
              conversationId: result[0]._id,
            },
            {
              $push: {
                message: {
                  senderId: req.user._id,
                  receiverId: req.params.receiverId,
                  senderName: req.user.username,
                  receiverName: req.body.receiverName,
                  body: req.body.message,
                  isRead: false,
                  createdAt: Date.now (),
                },
              },
            }
          )
            .then (() =>
              res
                .status (HttpStatus.OK)
                .json ({message: 'Message sent Successfully'})
            )
            .catch (err =>
              res
                .status (HttpStatus.INTERNAL_SERVER_ERROR)
                .json ({message: 'Error occured'})
            );
        } else {
          // this else case will only execute once when the user start new Conversation
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
          newMessage.message.push ({
            senderId: req.user._id,
            receiverId: req.params.receiverId,
            senderName: req.user.username,
            receiverName: req.body.receiverName,
            body: req.body.message,
            isRead: false,
            createdAt: Date.now (),
          });

          await User.update (
            {_id: req.user._id},
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      receiverId: req.params.receiverId,
                      messageId: newMessage,
                    },
                  ],
                  $position: 0,
                },
              },
            }
          );

          await User.update (
            {_id: req.params.receiverId},
            {
              $push: {
                chatList: {
                  $each: [
                    {
                      receiverId: req.user._id,
                      messageId: newMessage,
                    },
                  ],
                  $position: 0,
                },
              },
            }
          );

          await newMessage
            .save ()
            .then (() =>
              res.status (HttpStatus.OK).json ({message: 'Message sent'})
            )
            .catch (err =>
              res
                .status (HttpStatus.INTERNAL_SERVER_ERROR)
                .json ({message: 'Error occured'})
            );
        }
      }
    );
  },
  async MarkReceiverMessages (req, res) {
    const {senderName, receiverName} = req.params;

    /**
     * it will go each message document
     * than inside messages array and
     * search for where 
     * senderName: receiverName
     * receiverName: senderName
     */

    const messages = await Message.aggregate ([
      {
        $unwind: '$message',
      },
      {
        $match: {
          $and: [
            {
              'message.senderName': receiverName,
              'message.receiverName': senderName,
            },
          ],
        },
      },
    ]);

    if (messages.length > 0) {
      try {
        messages.forEach (async value => {
          await Message.update (
            {
              'message._id': value.message._id,
            },
            {
              $set: {
                'message.$.isRead': true,
              },
            }
          );
        });
        res.status (HttpStatus.OK).json ({message: 'Messages marked as read'});
      } catch (err) {
        res
          .status (HttpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error Occured'});
      }
    }
  },
  async MarkAllMessages (req, res) {
    const messages = await Message.aggregate ([
      {$match: {'message.receiverName': req.user.username}},
      {$unwind: '$message'},
      {$match: {'message.receiverName': req.user.username}},
    ]);

    // console.log (messages);

    if (messages.length > 0) {
      try {
        messages.forEach (async value => {
          await Message.update (
            {
              'message._id': value.message._id,
            },
            {
              $set: {
                'message.$.isRead': true,
              },
            }
          );
        });
        res
          .status (HttpStatus.OK)
          .json ({message: 'All Messages marked as read'});
      } catch (err) {
        res
          .status (HttpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error Occured'});
      }
    }
  },
};
