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
              userFollowed: req.body.userFollowed,
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
};
