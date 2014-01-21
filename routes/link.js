
/*
 * GET users listing.
 */

exports.findByURL = function(db, Link){ // TODO: remove reference to db
  return function(req,res){
    var dogeURL = req.params.dogeUrl;
    console.log('wow. such findbyURL. very find, dogeurl: ' + dogeURL);
    Link.findOne({'dogeUrl': dogeURL}, function(e, docs){
      if (e) console.log("Error: ", e);
      else {
        var visits = docs.visits || "no";
        res.redirect('/showlink/' + docs.dogeUrl + '/?clicks=' + visits);
      }
    });
  };
};

exports.redirectToDoge = function(db, Link){ // TODO: remove reference to db
  return function(req,res){
    console.log(req.params)
    var dogeURL = req.params.dogeUrl;
    console.log('wow. such link. very find: ' + dogeURL);
    Link.findOne({'dogeUrl': dogeURL}, function(e, docs){
      if (e) {
        console.log("Error: ", e);
        res.redirect('/failure');
      } else {
        console.log(docs);
        docs.visits = (typeof docs.visits === "number") ? docs.visits + 1 : 1;
        console.log(docs);
        docs.save(function(err){
          if (err) console.log('could not save updated visit count');
        });
        res.redirect(docs.url);
      }
    });
  };
};

