const express = require('express');

const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


// *Middleware* //
app.use(express.json());

// if we are in the development:
if (process.env.NODE_ENV === 'development') {
  //morgan use to log http requests
  app.use(morgan('dev'));
}

// *Routes* //
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;


