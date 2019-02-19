const Joi = require ('joi');

module.exports = {
  CreateUser (req, res) {
    const schema = Joi.object ().keys ({
      username: Joi.string ().min (5).max (10).required (),
      email: Joi.string ().email ().required (),
      password: Joi.string ().min (5).required (),
    });

    const {error, value} = Joi.validate (req.body, schema);
    if (error && error.details) {
      return res.status (500).json ({message: error.details});
    }
  },
};
