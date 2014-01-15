var http = require('http');
var https = require('https');
var url = require('url');
// var html = require('html');


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

exports.addlink = function(Link) {
  var createHash = function(str){
    var hash = 0, i, char;
    if (str.length == 0) return hash;
    for (i = 0, l = str.length; i < l; i++) {
      char  = str.charCodeAt(i);
      hash  = ((hash<<5)-hash)+char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
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

    var request = http.get(options, function(res){
      res.on('data', function(chunk){
        var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;
        var str = chunk.toString();
        var match = re.exec(str);
        if (match && match[2]) {
          linkTitle = match[2];
        }
      });

      res.on('end', function(){
        linkTitle = linkTitle || "such link. wow";

        var dogeifiedURL = createHash(linkTitle);
        
        var link = new Link({
          "linkTitle" : linkTitle,
          "url": url.href,
          "dogeUrl": url.href
        });

        link.save(function(err){
          if (err) console.log("ERROR:", err);
          else console.log("SUCCESS");
        });
      });
    });

    // linkTitle: String,
    // url: String,
    // dogeUrl: String

    // Get our form values. These rely on the "name" attributes

    // Set our collection

    // var collection = db.find('link');

    // // Submit to the DB
    // collection.insert({
    //   "linkTitle" : linkTitle,
    //   "url": url,
    //   "dogeUrl": url
    // }, function (err, doc) {
    //   if (err) {
    //     // If it failed, return error
    //     res.send("There was a problem adding the information to the database.");
    //   }
    //   else {
    //     // If it worked, set the header so the address bar doesn't still say /addlink
    //     res.location("linklist");
    //     // And forward to success page
    //     res.redirect("linklist");
    //   }
    // });

  };
};