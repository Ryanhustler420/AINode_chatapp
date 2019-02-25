const Joi = require ('joi');
const User = require ('../models/userModal');
const Post = require ('../models/postModals');
const HttpStatus = require ('http-status-codes');

module.exports = {
  AddPost (req, res) {
    const schema = Joi.object ().keys ({
      post: Joi.string ().required (),
    });

    const {error} = Joi.validate (req.body, schema);
    if (error && error.details) {
      return res.status (HttpStatus.BAD_REQUEST).json ({msg: error.details});
    }

    const body = {
      userId: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date (),
    };

    Post.create (body)
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
  },

  async GetAllPosts (req, res) {
    try {
      const posts = await Post.find ({})
        .populate ('userId')
        .sort ({created: -1});

      return res.status (HttpStatus.OK).json ({message: 'All posts', posts});
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
