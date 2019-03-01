const HttpStatus = require ('http-status-codes');

const User = require ('../models/userModal');

module.exports = {
  FollowUser (req, res) {
    const followUser = async () => {
      // who is start following
      await User.update (
        {
          _id: req.user._id,
          'following.userFollowed': {$ne: req.body.userFollowed},
        },
        {
          $push: {
            following: {
              userFollowed: req.body.userFollowed._id,
            },
          },
        }
      );

      // who is followed
      await User.update (
        {
          _id: req.body.userFollowed,
          'followers.follower': {$ne: req.user._id},
        },
        {
          $push: {
            followers: {
              follower: req.user._id,
            },
            notifications: {
              senderId: req.user._id,
              message: `${req.user.username} is now following you.`,
              created: new Date (),
              viewProfile: false,
            },
          },
        }
      );
    };

    followUser ()
      .then (() => {
        res.status (HttpStatus.OK).json ({
          message: 'Following user now',
        });
      })
      .catch (err => {
        res.status (HttpStatus.INTERNAL_SERVER_ERROR).json ({
          message: 'Error occured',
        });
      });
  },

  UnFollowUser (req, res) {
    const followUser = async () => {
      // who is start following
      await User.update (
        {
          _id: req.user._id,
        },
        {
          $pull: {
            following: {
              userFollowed: req.body.userUnFollowed._id,
            },
          },
        }
      );

      // who is followed
      await User.update (
        {
          _id: req.body.userUnFollowed,
        },
        {
          $pull: {
            followers: {
              follower: req.user._id,
            },
          },
        }
      );
    };

    followUser ()
      .then (() => {
        res.status (HttpStatus.OK).json ({
          message: 'Unfollowing user',
        });
      })
      .catch (err => {
        res.status (HttpStatus.INTERNAL_SERVER_ERROR).json ({
          message: 'Error occured',
        });
      });
  },
  async MarkNotification (req, res) {
    await User.updateOne (
      {
        _id: req.user._id,
        'notifications._id': req.params.id,
      },
      {
        $set: {'notifications.$.read': true},
      }
    )
      .then (() => {
        res.status (HttpStatus.OK).json ({message: 'Marked as read!'});
      })
      .catch (err => {
        res
          .status (HttpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured!'});
      });
  },
  async DeleteNotification (req, res) {
    await User.updateOne (
      {
        _id: req.user._id,
        'notifications._id': req.params.id,
      },
      {
        $pull: {
          notifications: {
            _id: req.params.id,
          },
        },
      }
    )
      .then (() => {
        res.status (HttpStatus.OK).json ({message: 'Deleted Successfully'});
      })
      .catch (err => {
        res
          .status (HttpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured!'});
      });
  },

  async MarkAllNotifications (req, res) {
    // https://stackoverflow.com/questions/4669178/how-to-update-multiple-array-elements-in-mongodb
    await User.update (
      {_id: req.user._id},
      {$set: {'notifications.$[elem].read': true}},
      {arrayFilters: [{'elem.read': false}], multi: true}
    )
      .then (() => {
        res.status (HttpStatus.OK).json ({message: 'Marked all Successfully'});
      })
      .catch (err => {
        res
          .status (HttpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured!'});
      });
  },
};
