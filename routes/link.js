
/*
 * GET users listing.
 */

exports.list = function(req, res){
    db.collection
};

exports.findByURL = function(db, Link){
  return function(req,res){
    var dogeURL = req.params.dogeUrl;
    console.log('wow. such findbyURL. very find, dogeurl: ' + dogeURL);
    Link.find({'dogeUrl': dogeURL}, function(e, docs){
      console.log('docs:', docs);
      if (e) console.log("Error: ", e);
      else res.redirect(docs[0].url);
    });
    // var collection = db.get('link');
    // collection.find({}, {}, function(e, docs){
    //   res.render('linklist', {
    //     'link': docs
    //   });
    // });
  };
};

exports.redirectToDoge = function(db, Link){
  return function(req,res){
    console.log(req.params)
    var dogeURL = req.params.dogeUrl;
    console.log('wow. such link. very find: ' + dogeURL);
    Link.find({'dogeUrl': dogeURL}, function(e, docs){
      if (e) console.log("Error: ", e);
      else console.log(docs);
    });
  };
};

