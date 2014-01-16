var http = require('http');
var https = require('https');
var html = require('html');
var url = require('url');
var _ = require('underscore');

var modifiers = ['such', 'many', 'so', 'very', 'much'];
var nouns = ['internet', 'search', 'social', 'shibe', 'virus', 'server', 'loadtime', '404', 'cookie', 'redirect', 'NSA', 'link', 'bookmark', 'hacker', 'n00b', 'www', 'doge', 'short', 'url', 'http'];

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
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

exports.showlink = function(req, res){
  console.log(res.req.params.dogeUrl)
  res.render('suchlink', {title: res.req.params.dogeUrl})
};

exports.addlink = function(Link) {

  var create10Hash = function(str){
    var hash = 0, i, char;
    if (str.length == 0) return hash;
    for (i = 0, l = str.length; i < l; i++) {
      char  = str.charCodeAt(i);
      hash  = ((hash<<5)-hash)+char;
      hash |= 0; // Convert to 32bit integer
    }
    // hash = Math.abs(hash) + '';
    // while (hash.length < 10) {
    //   hash = '0' + hash;
    // }
    // return hash.slice(0, 10);
    return Math.abs(hash);
  };

  var takeRandomElemOf = function(arr){
    console.log(Math.floor(Math.random()*arr.length));
    return arr[Math.floor(Math.random()*arr.length)];
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

    var url_parts = url.parse(req.body.url, true);
    if (!url_parts.protocol) {
      url_parts.protocol = 'http:';
      url_parts.host = 'www.' + url.pathname;
      url_parts.hostname = 'www.' + url.pathname;
    }
    var query = url_parts.query;
    var options = {
      host: url_parts.host,
      query: query
    };

    var linkTitle;

    linkTitle = linkTitle || "such link. wow";
    var dogeLink = createDogeLink(url_parts.href);

    console.log(linkTitle, url_parts.href, dogeLink);

    var link = new Link({
      "linkTitle" : linkTitle,
      "url": url_parts.href,
      "dogeUrl": dogeLink
    });

    link.save(function(err){
      if (err) {
        console.log("ERROR:", err);
        res.redirect('failure');
    } else {
        console.log("SUCCESS");
        res.redirect('/links/' + dogeLink);
      }
    });

  };
};