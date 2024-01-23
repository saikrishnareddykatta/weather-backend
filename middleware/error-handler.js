const { customError } = require("../errors/custom-error");
const errorHandlerMiddleWare = (err, req, res, next) => {
  if (err instanceof customError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(500)
    .json({ msg: "Something went Wrong, please try again!!!", err });
};

module.exports = errorHandlerMiddleWare;
