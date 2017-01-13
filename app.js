var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var slots = require('./routes/slots');

var app = express();

// #######################################################################
var scraper=require('./scrapper');
scraper.scrape();
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/slots', slots);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//$$$$$$$$$   learn to get table by td and tr      $$$$$$$$ /////////

                  //only theory subjects if condition


                  // for (var i = 0; i < table.find('tr').length; i++) {
                  //   for (var j = 0; j < table.find('tr').eq(i).find('td').length; j++) {
                  //     if(table.find('tr').eq(i).find('td').eq(7).text()=="CBL")
                  //   console.log(table.find('tr').eq(i).find('td').eq(j).text());
                  //   }
                  // }
                  