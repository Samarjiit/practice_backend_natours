const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./rou/tourRou');
const userRouter = require('./rou/userRou');
const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hello from the server', app: 'Natours' });
// });

//1.MIDDLEWARE
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  //it will avaialable to every single file in the process
  app.use(morgan('dev'));
}
app.use(express.json()); //middleware   //app.use means adding middlewares

//applied to every single request
app.use((req, res, next) => {
  console.log('hello from the middleware👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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

//4.START THE SERVER

module.exports = app;
