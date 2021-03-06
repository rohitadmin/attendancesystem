var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var ejs= require('ejs');
var date = require('date-and-time');
var hbs= require('hbs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var expressValidator=require('express-validator'); 
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload =multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');

//var port = process.env.PORT || 3000;
var db= mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
hbs.registerPartials(path.join(__dirname,  'views/partials'));
app.set('view engine', 'hbs');

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');



//handle file uploads
//app.use(multer({dest:'./uploads'}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handle sessions

app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

// validator

app.use(expressValidator({
	errorFormatter: function(param,msg,value){
		var namespace=param.split('.')
		,root = namespace.shift()
		,formParam =root;

		while(namespace.length){
			formParam += '[' +namespace.shift() +']';
		}
		return{
			param : formParam,
			msg   : msg,
			value : value
		};
	}
})); 

//flash message

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// app.get('*', function(req, res,next){
// 	res.locals.user = req.user || null;
// 	next();
// });

//date and time
var now = new Date();

date.format(now, 'ddd MMM DD YYYY');        // => 'Fri Jan 02 2015'
date.format(now, 'hh:mm A [GMT]Z');         // => '11:14 p.m. GMT-0800'



app.use('/', indexRouter);
app.use('/users', usersRouter);


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
