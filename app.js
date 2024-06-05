const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = reuire('hpp');
const AppError = require('./utils/appError');
const tourRouter = require('./rou/tourRou');
const userRouter = require('./rou/userRou');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hello from the server', app: 'Natours' });
// });

//1.GLOBAL MIDDLEWARE
// set security http headers
app.use(helmet()); // helps protect your server from some well-known web vulnerabilities by setting HTTP response headers appropriately

console.log(process.env.NODE_ENV);
//development logging
if (process.env.NODE_ENV === 'development') {
  //it will avaialable to every single file in the process
  app.use(morgan('dev'));
}
//limit request from same api
//in order to prevent the same IP from making too many requests to our API and that will then help us preventing attacks like denial of service, or brute force attacks. So, that rate limiter will be implemented as a global middleware function
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // allow 100 request from the same ip in 1 hr. if it cross so error shown up
  message: 'too many request from this ip,please try agains in an hour!!!',
});

app.use('/api', limiter); //allow limiter only to /api routes
//body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //middleware   //app.use means adding middlewares

//data sanitization  - basically means to clean all the data that comes into the application from malicious code. So, code that is trying to attack our application.
//data sanitization against nosql query injection
app.use(mongoSanitize());
//datat sanitization against xss
app.use(xss()); //This will then clean any user input from malicious HTML code, basically. Imagine that an attacker would try to insert some malicious HTML code with some JavaScript code attached to it. If that would then later be injected into our HTML site, it could really create some damage then. Using this middleware, we prevent that basically by converting all these HTML symbols.
//applied to every single request
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
app.use((req, res, next) => {
  console.log('hello from the middleware👋');
  next();
});
//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers); //access to http request headers
  next();
});
/*
In the context of a Node.js application using the Express.js framework, `app.use(express.json())` is a middleware function. 

Middleware functions in Express.js have access to the request object (`req`), the response object (`res`), and the next middleware function in the application’s request-response cycle. 

`express.json()` is built-in middleware in Express.js that parses incoming requests with JSON payloads. When you call `app.use(express.json())`, you are telling your Express application to use this middleware for every incoming request. This middleware parses the JSON payload of the request and populates the `req.body` property with the parsed JSON data, making it accessible to your application's routes and handlers. This way, you can easily work with JSON data in your Express application.
*/

//2.ROUTE HANDLERS

//:id? means optinal parameter

//3. ROUTES

app.use('/api/v1/tours', tourRouter); //tourRouter is a middleware
app.use('/api/v1/users', userRouter);

//handling unhandler routes
app.all('*', (req, res, next) => {
  next(new AppError(`cant't find ${req.originalUrl} on this server!!`, 404));
  // const err = new Error(`cant't find ${req.originalUrl} on this server!!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
});

app.use(globalErrorHandler);

//4.START THE SERVER

module.exports = app;
