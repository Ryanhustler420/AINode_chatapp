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
      return res
        .status (HttpStatus.BAD_REQUEST)
        .json ({message: error.details});
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
            expiresIn: 120,
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
};
