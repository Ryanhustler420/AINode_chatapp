const User = require ('../models/userModal');
const httpStatus = require ('http-status-codes');
const moment = require ('moment');
const Joi = require ('joi');
const bcrypt = require ('bcryptjs');

module.exports = {
  async GetAllUsers (req, res) {
    await User.find ({})
      .populate ('posts.postId')
      .populate ('following.userFollowed')
      .populate ('followers.follower')
      .populate ('chatList.receiverId')
      .populate ('chatList.messageId')
      .populate ('notifications.senderId')
      .populate ({
        path: 'posts.postId',
        populate: {
          path: 'userId',
          model: 'User',
        },
      })
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
      .populate ({
        path: 'posts.postId',
        populate: {
          path: 'userId',
          model: 'User',
        },
      })
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
      .populate ({
        path: 'posts.postId',
        populate: {
          path: 'userId',
          model: 'User',
        },
      })
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
    // console.log (req.body);
    const schema = Joi.object ().keys ({
      cpassword: Joi.string ().required (),
      newPassword: Joi.string ().min (5).required (),
      confirmPassword: Joi.string ().min (5).optional (),
    });

    const {error, value} = Joi.validate (req.body, schema);
    if (error && error.details) {
      return res.status (httpStatus.BAD_REQUEST).json ({
        message: error.details,
      });
    }

    const user = await User.findOne ({_id: req.user._id});

    return bcrypt
      .compare (value.cpassword, user.password)
      .then (async result => {
        if (!result) {
          return res.status (httpStatus.INTERNAL_SERVER_ERROR).json ({
            message: 'Current password is incorrect!',
          });
        }

        const newPassword = await User.EncryptPassword (req.body.newPassword);
        // console.log (newPassword);
        await User.update ({_id: req.user._id}, {password: newPassword})
          .then (() => {
            res
              .status (httpStatus.OK)
              .json ({message: 'Password Changed Successfully', result});
          })
          .catch (() => {
            res
              .status (httpStatus.INTERNAL_SERVER_ERROR)
              .json ({message: 'Error occured'});
          });
      });
  },
};
