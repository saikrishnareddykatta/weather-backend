class customError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const customErrorMiddleware = (message, statusCode) => {
  return new customError(message, statusCode);
};

module.exports = { customErrorMiddleware, customError };
