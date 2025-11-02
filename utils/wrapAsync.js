// // utils/ExpressError.js
// class ExpressError extends Error {
//   constructor(statusCode, message) {
//     super();
//     this.statusCode = statusCode;
//     this.message = message;
//   }
// }

// module.exports = ExpressError;


module.exports = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};

