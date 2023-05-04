const express = require('express');

const AppError = require('./utils/appError')
const globalErrHandler = require('./controllers/errController')
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


// *Middleware* //
app.use(express.json());


// *Routes* //
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrHandler)


module.exports = app;


