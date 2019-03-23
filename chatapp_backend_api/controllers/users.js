const User = require ('../models/userModal');
const httpStatus = require ('http-status-codes');
const moment = require ('moment');

module.exports = {
  async GetAllUsers (req, res) {
    await User.find ({})
      .populate ('posts.postId')
      .populate ('following.userFollowed')
      .populate ('followers.follower')
      .populate ('chatList.receiverId')
      .populate ('chatList.messageId')
      .populate ('notifications.senderId')
      .then (result => {
        res.status (httpStatus.OK).json ({message: 'All users', result});
      })
      .catch (err => {
        res
          .status (httpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured'});
      });
  },

  async GetUser (req, res) {
    await User.findOne ({_id: req.params.id})
      .populate ('posts.postId')
      .populate ('following.userFollowed')
      .populate ('followers.follower')
      .populate ('chatList.receiverId')
      .populate ('chatList.messageId')
      .populate ('notifications.senderId')
      .then (result => {
        res.status (httpStatus.OK).json ({message: 'User by id', result});
      })
      .catch (err => {
        res
          .status (httpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured'});
      });
  },

  async GetUserByName (req, res) {
    await User.findOne ({username: req.params.username})
      .populate ('posts.postId')
      .populate ('following.userFollowed')
      .populate ('followers.follower')
      .populate ('chatList.receiverId')
      .populate ('chatList.messageId')
      .populate ('notifications.senderId')
      .then (result => {
        res.status (httpStatus.OK).json ({message: 'User by username', result});
      })
      .catch (err => {
        res
          .status (httpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured'});
      });
  },
  async SendViewProfileNotification (req, res) {
    const dateValue = moment ().format ('YYYY-MM-DD');
    const useridFromParams = {id: req.params.id};
    await User.update (
      {
        _id: useridFromParams.id,
        'notifications.date': {$ne: [dateValue, '']},
        'notifications.senderId': {$ne: req.user._id},
      },
      {
        $push: {
          notifications: {
            senderId: req.user._id,
            message: `${req.user.username} viewed your profile`,
            created: new Date (),
            date: dateValue,
            viewProfile: true,
          },
        },
      }
    )
      .then (result => {
        res
          .status (httpStatus.OK)
          .json ({message: 'Notification sent', result});
      })
      .catch (err => {
        res
          .status (httpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured'});
      });
  },
  async ChangePassword (req, res) {
    console.log (req.body);
  },
};
