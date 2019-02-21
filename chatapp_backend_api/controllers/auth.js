const Joi = require ('joi');
const HttpStatus = require ('http-status-codes');

const User = require ('../models/userModal');
const Helper = require ('../Helpers/helpers');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const dbConfig = require ('../config/secret');

module.exports = {
  async CreateUser (req, res) {
    const schema = Joi.object ().keys ({
      username: Joi.string ().min (5).max (10).required (),
      email: Joi.string ().email ().required (),
      password: Joi.string ().min (5).required (),
    });

    const {error, value} = Joi.validate (req.body, schema);
    if (error && error.details) {
      return res.status (HttpStatus.BAD_REQUEST).json ({msg: error.details});
    }

    const {username, email, password} = req.body;

    const userEmail = await User.findOne ({email: Helper.lowerCase (email)});
    if (userEmail) {
      return res
        .status (HttpStatus.CONFLICT)
        .json ({message: 'Email already exist'});
    }

    const userName = await User.findOne ({
      username: Helper.firstLetterUpperCase (username),
    });

    if (userName) {
      return res
        .status (HttpStatus.CONFLICT)
        .json ({message: 'Username already exist'});
    }

    return bcrypt.hash (password, 10, (err, hash) => {
      if (err) {
        return res
          .status (HttpStatus.BAD_REQUEST)
          .json ({message: 'Error hasing password'});
      }

      const body = {
        username: Helper.firstLetterUpperCase (username),
        email: Helper.lowerCase (email),
        password: hash,
      };

      User.create (body)
        .then (user => {
          const token = jwt.sign ({data: user}, dbConfig.secret, {
            expiresIn: '1h',
          });
          res.cookie ('auth', token);
          res
            .status (HttpStatus.CREATED)
            .json ({message: 'User created successfully', user, token});
        })
        .catch (err => {
          res
            .status (HttpStatus.INTERNAL_SERVER_ERROR)
            .json ({message: 'Error occured'});
        });
    });
  },

  async LoginUser (req, res) {
    const {username, password} = req.body;

    if (!username || !password) {
      return res.status (HttpStatus.NOT_FOUND).json ({
        message: 'No Empty Fields Allowed',
      });
    }

    await User.findOne ({
      username: Helper.firstLetterUpperCase (username),
    })
      .then (user => {
        if (!user) {
          return res.status (HttpStatus.NOT_FOUND).json ({
            message: 'Username not found',
          });
        }

        return bcrypt.compare (password, user.password).then (result => {
          if (!result) {
            return res.status (HttpStatus.INTERNAL_SERVER_ERROR).json ({
              message: 'Password is incorrect',
            });
          }
          const token = jwt.sign ({data: user}, dbConfig.secret, {
            expiresIn: '1h',
          });
          res.cookie ('auth', token);
          return res.status (HttpStatus.OK).json ({
            message: 'Login successful',
            user,
            token,
          });
        });
      })
      .catch (err => {
        return res.status (HttpStatus.INTERNAL_SERVER_ERROR).json ({
          message: 'Error Occured',
        });
      });
  },
};
