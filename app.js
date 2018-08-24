var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var queryRouter = require('./routes/query');
var getuserinfoRouter = require('./routes/getuserinfo');
var ordercreateRouter = require('./routes/ordercreate');
var queryorderRouter = require('./routes/queryorder');
var transferRouter = require('./routes/transfer');
var transferqueryRouter = require('./routes/transferquery');
var paycallbackRouter = require('./routes/paycallback')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//parse application/json
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/login', loginRouter);
app.use('/query',queryRouter);
app.use('/getuserinfo',getuserinfoRouter);
app.use('/ordercreate',ordercreateRouter);
app.use('/queryorder',queryorderRouter);
app.use('/transfer',transferRouter);
app.use('/transferquery',transferqueryRouter);
app.use('/api/pay/callback',paycallbackRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
