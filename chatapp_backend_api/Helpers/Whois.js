/**
 * This is a middle ware. you can use the middleware to know who is make API calls.
 * This parse the user cookies and extract info from that.
 */

const jwt = require ('jsonwebtoken');
const httpStatus = require ('http-status-codes');
const dbConfig = require ('../config/secret');

module.exports = {
  VerifyToken: (req, res, next) => {
    if (req.headers.authorization) {
      return res
        .status (httpStatus.UNAUTHORIZED)
        .json ({message: 'No Authorization'});
    }
    const token = req.cookies.auth || req.headers.authorization.split (' ')[1];
    // console.log (token);
    // console.log (req.headers);
    // check the token is available
    if (!token) {
      return res.status (httpStatus.FORBIDDEN).json ({
        message: 'No token provided',
      });
    }
    // check if token is valid or not
    return jwt.verify (token, dbConfig.secret, (err, decoded) => {
      if (err) {
        if (err.expiredAt < new Date ()) {
          return res.status (httpStatus.INTERNAL_SERVER_ERROR).json ({
            message: 'Token has expired. Please login again',
            token: null,
          });
        }
        next ();
      }

      req.user = decoded.data;
      next ();
    });
  },
};
