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


// var checkDOMforTagValue = function(dom, tag, checking){
//   _.each(dom, function(value, key, collection){
//     if (value.name === tag) {
//       if (value.children[0].raw === checking) {
//         console.log("YO BITCH");
//         return true;
//       }
//     } else {
//       if (value.children){
//         return checkDOMforTagValue(value.children, tag, checking);
//       }
//     }
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

  // it('follows the link to the intended website', function(done){
  //   request.get(host + googleDoge, function(err, response, body){
  //     if (!err && response.statusCode === 200){
  //       var handler = new htmlparser.DefaultHandler(function (error, dom) {
  //         if (error) {
  //           console.error(error);
  //         } else {
  //           assert(checkDOMforTagValue(dom, "title", "Google") === true);
  //           // assert(dom[1].children[0].children[3].children[0].raw === "Google");
  //           done();
  //         }
  //       });
  //       var parser = new htmlparser.Parser(handler);
  //       parser.parseComplete(body);
  //     } else console.error(err);
  //   });
  // });
});