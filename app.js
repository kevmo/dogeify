
//
// Module dependencies.
//

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//initialize express

var app = express();

//
// environment configuration
//

app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//
// development only - error checking
//

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//
// routes
//

app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/profile', routes.profile);

//
// create and launch server
//

http.createServer(app).listen(app.get('port'), function(){
  console.log('This is EXPRESS listening on ' + app.get('port'));
});

// could also use:
// app.listen(app.get('port'));