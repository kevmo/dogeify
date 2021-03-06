// node app.js
// mongod
// ^^ in home directory, to start app

//
// Module dependencies.
//

var express = require('express');
var routes = require('./routes/index');
var link = require('./routes/link');
var http = require('http');
var path = require('path');
var _ = require('underscore');


//
// mongoose
//

var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/nodetest';
mongoose.connect(mongoUri);
var db = mongoose.connection;

//listen for connections

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback(){
  console.log("mongo successfully started");
});

//  mongoose schema

var Schema = mongoose.Schema;

var linkSchema = new Schema({
  linkTitle: String,
  url: String,
  dogeUrl: String,
  visits: Number
});

//  mongoose model

var Link = mongoose.model('Link', linkSchema);

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
app.get('/linklist', routes.linklist(db, Link));
app.get('/newlink', routes.newlink);
app.get('/showlink/:dogeUrl', routes.showlink);
app.get('/failure', routes.showFail);
app.get('/links/:dogeUrl', link.findByURL(db, Link));
app.get('/:dogeUrl', link.redirectToDoge(db, Link));

app.post('/addlink', routes.addlink(Link));

//
// create and launch server
//

http.createServer(app).listen(app.get('port'), function(){
  console.log('this ya boi EXPRESS.COM we outchea on ' + app.get('port'));
});

// could also use:
// app.listen(app.get('port'));
