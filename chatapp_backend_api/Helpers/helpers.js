const User = require ('../models/userModal');

module.exports = {
  firstLetterUpperCase: username => {
    const name = username.toLowerCase ();
    return name.charAt (0).toUpperCase () + name.slice (1);
  },

  lowerCase: str => {
    return str.toLowerCase ();
  },

  updateChatList: async (req, _messageId) => {
    // sender
    await User.update (
      {
        _id: req.user._id,
      },
      {
        $pull: {
          chatList: {
            receiverId: req.params.receiverId,
          },
        },
      }
    );
    // receiver
    await User.update (
      {
        _id: req.params.receiverId,
      },
      {
        $pull: {
          chatList: {
            receiverId: req.user._id,
          },
        },
      }
    );

    await User.update (
      {_id: req.user._id},
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.params.receiverId,
                messageId: _messageId._id,
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
                messageId: _messageId._id,
              },
            ],
            $position: 0,
          },
        },
      }
    );
  },
};
