const Joi = require ('joi');
const User = require ('../models/userModal');
const Post = require ('../models/postModals');
const HttpStatus = require ('http-status-codes');
const cloudinary = require ('cloudinary');
const moment = require ('moment');

cloudinary.config ({
  cloud_name: 'dcalvdelc',
  api_key: '376372284163297',
  api_secret: 'i1E9ZLJVEnQguz9UdhRj7VUmVuY',
});

module.exports = {
  AddPost (req, res) {
    const schema = Joi.object ().keys ({
      post: Joi.string ().required (),
      // image: Joi.string ().optional (),  // this is possible
    });

    const body = {
      post: req.body.post,
    };

    const {error} = Joi.validate (body, schema);
    if (error && error.details) {
      return res.status (HttpStatus.BAD_REQUEST).json ({msg: error.details});
    }

    const bodyObj = {
      userId: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date (),
    };

    if (req.body.post && !req.body.image) {
      Post.create (bodyObj)
        .then (async post => {
          await User.update (
            {
              _id: req.user._id,
            },
            {
              $push: {
                posts: {
                  postId: post._id,
                  post: req.body.post,
                  created: new Date (),
                },
              },
            }
          );
          res.status (HttpStatus.OK).json ({
            message: 'Post Created',
            post,
          });
        })
        .catch (err => {
          res.status (HttpStatus.INTERNAL_SERVER_ERROR).json ({
            message: 'Error occured',
          });
        });
    }

    if (req.body.post && req.body.image) {
      cloudinary.uploader.upload (req.body.image, async result => {
        console.log (result);
        const reqBody = {
          userId: req.user._id,
          username: req.user.username,
          post: req.body.post,
          imgId: result.public_id,
          imgVersion: result.version,
          created: new Date (),
        };

        Post.create (reqBody)
          .then (async post => {
            await User.update (
              {
                _id: req.user._id,
              },
              {
                $push: {
                  posts: {
                    postId: post._id,
                    post: req.body.post,
                    created: new Date (),
                  },
                },
              }
            );
            res.status (HttpStatus.OK).json ({
              message: 'Post Created',
              post,
            });
          })
          .catch (err => {
            res.status (HttpStatus.INTERNAL_SERVER_ERROR).json ({
              message: 'Error occured',
            });
          });
      });
    }
  },

  async GetAllPosts (req, res) {
    try {
      const today = moment ().startOf ('day');
      const tommorow = moment (today).add (1, 'days');

      const posts = await Post.find ({
        created: {$gte: today.toDate (), $lt: tommorow.toDate ()},
      })
        .populate ('userId')
        .sort ({created: -1});

      const TopPosts = await Post.find ({
        totalLikes: {$gte: 2},
        created: {$gte: today.toDate (), $lt: tommorow.toDate ()},
      })
        .populate ('userId')
        .sort ({created: -1});

      return res
        .status (HttpStatus.OK)
        .json ({message: 'All posts', posts, TopPosts});
    } catch (err) {
      return res
        .status (HttpStatus.INTERNAL_SERVER_ERROR)
        .json ({message: 'Error occured'});
    }
  },

  async GetSinglePost (req, res) {
    await Post.findOne ({_id: req.params.id})
      .populate ('userId')
      .populate ('comments.userId')
      .then (post =>
        res.status (HttpStatus.OK).json ({message: 'Post found', post})
      )
      .catch (err =>
        res
          .status (HttpStatus.NOT_FOUND)
          .json ({message: 'Post not found', post})
      );
  },

  async AddLike (req, res) {
    const post_id = req.body._id;

    await Post.update (
      {
        _id: post_id,
        'likes.username': {$ne: req.user.username},
      },
      {
        $push: {
          likes: {username: req.user.username},
        },
        $inc: {totalLikes: 1},
      }
    )
      .then (() => {
        res.status (HttpStatus.OK).json ({message: 'You liked the post'});
      })
      .catch (err =>
        res
          .status (HttpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured'})
      );
  },

  async AddComment (req, res) {
    // console.log (req.body);
    const post_id = req.body.postId;

    await Post.update (
      {
        _id: post_id,
      },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: Date.now (),
          },
        },
      }
    )
      .then (() => {
        res.status (HttpStatus.OK).json ({message: 'Comment has added'});
      })
      .catch (err =>
        res
          .status (HttpStatus.INTERNAL_SERVER_ERROR)
          .json ({message: 'Error occured'})
      );
  },
};
