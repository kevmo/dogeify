// TO RUN THESE TESTS:
// issue "mocha -R nyan test/test.js" from the root directory

var assert = require('assert');
var should = require('should');
var request = require('request');
var async = require('async');
var htmlparser = require('htmlparser');
var _ = require('underscore');

var host = 'http://localhost:1337';
var googleDoge = '/such-bookmark-so-virus-such-redirect-so-hacker-much-search-wow';

var depthFirstEachDOM = function(dom, callback) {
  _.each(dom, function(value){
    callback(value);
    if (value.children) {
      depthFirstEachDOM(value.children, callback);
    }
  });
};

var checkDOMforTagValue = function(dom, tag, checking){
  var found = false;
  depthFirstEachDOM(dom, function(node){
    if (node.name === tag) {
      if (node.children[0].raw === checking){
        found = true;
      }
    }
  });
  return found;
};

// checkDOMforTagValue(dom, "title", "Google");


// var checkDOMforTagValue = function(dom, tag, checking){
//   if (value.name === tag) {
//     if (value.children[0].raw === checking) {
//       console.log("YO BITCH");
//       return true;
//     }
//   }
//   _.each(dom.children, function(value, key, collection){
//     return checkDOMforTagValue(value.children, tag, checking);
//   });
//   return false;
// };

describe("app should create links", function(){

  it('serves the home route', function(done){
    request.get(host, function(err, response, body){
      if (!err && response.statusCode === 200) {
        done();
      } else console.log(err);
    });
  });

  it('creates a link', function(done){
    request.get(host, function(err, response, body){
      if (!err && response.statusCode === 200) {
        request.post(host + '/addlink?url=http://www.google.com', function(err, response, body){
          done();
        });
      } else console.log(err);
    });
  });

  it('follows the link to the intended website', function(done){
    request.get(host + googleDoge, function(err, response, body){
      if (!err && response.statusCode === 200){
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
          if (error) {
            console.error(error);
          } else {
            assert(checkDOMforTagValue(dom, "title", "Google") === true);
            done();
          }
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
      } else console.error(err);
    });
  });
});