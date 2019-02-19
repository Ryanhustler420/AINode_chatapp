const Joi = require ('joi');
const HttpStatus = require ('http-status-codes');

const User = require ('../models/userModal');
const Helper = require ('../Helpers/helpers');

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
  },
};
