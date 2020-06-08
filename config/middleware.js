var express = require('express');
require('dotenv').config();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport');
var engine = require('ejs-locals');
var MongoDBStore = require('connect-mongodb-session')(session);
let cors = require('cors');
require('./passport')(passport);

var initMiddleware = function(app){
	// view engine setup
	app.set('views', path.join(__dirname, '../views'));
	// app.set('view engine', 'pug');
	app.set('view engine', 'ejs');


	app.locals.moment = require('moment');
	
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(methodOverride('_method'));
  	app.use(flash());
	app.use(cors());
  	//DB
	var store = new MongoDBStore({
		uri: process.env.DB_URI,
		collection: 'sessions'
	});
  	// Session
	app.use(session({
	    secret: '1cd9589eeee9a628ff35a9e4ba3607ed',
	    resave: true,
	    saveUninitialized: true,
	    cookie: { maxAge: 2628000000 }
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	// Usage variables
	app.use(function(req, res, next){
		res.locals.req = req;
		res.locals.session = req.session;
		res.locals.toastMessage = req.flash('toastMessage');
		res.locals.toastStatus = req.flash('toastStatus');
		if (res.locals.toastMessage != "" && res.locals.toastStatus != "") {
		  console.log('Flash Message: '+res.locals.toastMessage+' '+res.locals.toastStatus);
		}
		next();
	});
	app.use(express.static(path.join(__dirname, '../public')));
}

module.exports = initMiddleware