//Your progress Share Loaded: 5%Progress bar: 11.66% Lecture thumbnail 2x 1:01 / 8:49 Transcript In this video, let's talk about something that we have in node.js called unhandled rejections and then learn how we can actually handle them. So at this point, we have successfully handled errors in our express application by passing operational asynchronous errors down into a global error handling middleware. This, then sends relevant error messages back to the client depending on the type of error that occurred, right? However, there might also occur errors outside of express and a good example for that in our current application is the mongodb database connection. So imagine that the database is down for some reason or for some reason, we cannot log in. And in that case, there are errors that we have to handle as well. But they didn't occur inside of our express application and so, of course, our error handler that we implemented will not catch this errors, right? And so just to test what happens, let's go ahead and change our mongodb password, okay?
//all the errors are showing in production mode only :
//to run at production : np run start:prod
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired!! please login again', 401);
const sendErrorProd = (err, res) => {
  //opeational ,trusted erro :Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //programming or other unknown error :don't leak error details to client
  } else {
    //1. log error
    console.error('error 💣', err);
    //2. send general message
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!!',
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === '11000') error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    //error related to jsonweb  token
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
