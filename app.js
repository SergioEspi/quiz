var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz Sergio'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(methodOverride('_method'));

//Prueba para P2P M9
var prueba;

app.use(function myFunction(req,res,next){
	var actual = Date.now();
	var last;
	var dif = 0;
	
	if(req.session.user){
		last = new Date(req.session.user.last);
		dif = actual - last;
		if(dif > 20000){
			delete req.session.user;
			next();
		} else {
			req.session.user.last = actual;
			next();
		}
	} else {
		next();
	}
});


//Helpers dinamicos
app.use(function(req,res,next){
	//guardar path en session.redir para despues de login o logout
	if(!req.path.match(/\/login|\/logout/)){		
		req.session.redir = req.path;
	}
	
	//Hacer vidible req.session en las vistas
	res.locals.session = req.session;
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, 
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
