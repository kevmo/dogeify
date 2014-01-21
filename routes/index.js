var http = require('http');
var https = require('https');
var url = require('url');
var _ = require('underscore');

var modifiers = ['such', 'many', 'so', 'very', 'much'];
var nouns = ['internet', 'search', 'social', 'shibe', 'virus', 'server', 'loadtime', '404', 'cookie', 'redirect', 'NSA', 'link', 'bookmark', 'hacker', 'n00b', 'www', 'doge', 'short', 'url', 'http'];

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: "dogeify"});
};

// database route

exports.linklist = function(db){
  return function(req,res){
    var collection = db.get('link');
    collection.find({}, {}, function(e, docs){
      res.render('linklist', {
        'link': docs
      });
    });
  };
};

// add a new link to database

exports.newlink = function(req, res){
  res.render('newlink', {title: "Add New Link"});
};

exports.showFail = function(req, res){
  res.render('failure');
};

exports.showlink = function(req, res){
  var clicks = url.parse(req.url, true).query.clicks || "so mystery";
  res.render('suchlink', {link: res.req.params.dogeUrl, clicks: clicks});
};

exports.addlink = function(Link) {

  var create10Hash = function(str){
    var hash = 0, i, char;
    if (str.length === 0) return hash;
    for (i = 0, l = str.length; i < l; i++) {
      char  = str.charCodeAt(i);
      hash  = ((hash<<5)-hash)+char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  var createDogeLink = function(url){
    var hash = create10Hash(url);
    var dogeifiedURL = '';
    for (var i = 0; i < 5; i++){
      var part = hash % 100;
      dogeifiedURL = modifiers[Math.floor(part / 20)] + '-' + nouns[part % 20] + '-' + dogeifiedURL;
      hash = Math.floor(hash / 100);
    }
    return dogeifiedURL + 'wow';
  };

  return function(req, res) {
    var url_parts;
    if (req.body.url) {
      url_parts = url.parse(req.body.url, true);
      if (!url_parts.protocol) {
        url_parts.protocol = 'http:';
        url_parts.host = 'www.' + url_parts.pathname;
        url_parts.hostname = 'www.' + url_parts.pathname;
        url_parts.href = "http://" + url_parts.pathname;
      }
    } else {
      url_parts = _.extend(req._parsedUrl, req.query);
      url_parts.query = {url: url_parts.query.split('=')[1]};
      url_parts.href = url_parts.query.url;
    }
    var query = url_parts.query;
    var options = {
      host: url_parts.host,
      query: query
    };

    var linkTitle = "such link. wow";
    var dogeLink = createDogeLink(url_parts.href);

    var link = new Link({
      "linkTitle" : linkTitle,
      "url": url_parts.href,
      "dogeUrl": dogeLink,
      "visits": 0
    });

    link.save(function(err){
      if (err) {
        console.log("ERROR:", err);
        res.redirect('failure');
      } else {
        res.redirect('/links/' + dogeLink);
      }
    });

  };
};