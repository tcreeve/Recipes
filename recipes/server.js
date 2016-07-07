var express = require('express'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	passport = require('passport'),
	flash = require('connect-flash'),
	path = require('path');

var app = express();
var port = process.env.PORT || 8080;

//configure express application
//make public folder for images and such
app.use("/public", express.static(path.join(__dirname, 'public')));

//use engine
app.use(morgan('dev')); //log request to console
app.use(cookieParser()); //read cookies
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); //get info from HTML forms

//set view engine
app.set("view engine", "jade");

//make secure?
app.set('trust proxy', 1);

//passport use
app.use(session({
	secret: 'YisabelGuFamily',
	resave: true,
	saveUninitialized: true,
	secure: true,
	httpOnly: true
})); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistant login sessions
app.use(flash()); //connect-flash for flash messages stored in session (?)

//set routes
require('./includeJS/routes.js')(app, passport);

//runs code on server

var server = app.listen(port, function () {
    console.log('Node server is running on port '+port+'.');
});