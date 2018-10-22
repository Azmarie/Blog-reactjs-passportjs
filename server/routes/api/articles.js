const mongoose = require('mongoose');
const router = require('express').Router();
const Articles = mongoose.model('Articles');
const passport = require('passport');
require('../../config/passport')(passport);

router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
      const { body } = req;
    
      if(!body.title) {
        return res.status(422).json({
          errors: {
            title: 'is required',
          },
        });
      }
    
      if(!body.author) {
        return res.status(422).json({
          errors: {
            author: 'is required',
          },
        });
      }
    
      if(!body.body) {
        return res.status(422).json({
          errors: {
            body: 'is required',
          },
        });
      }
    
      const finalArticle = new Articles(body);
      return finalArticle.save()
        .then(() => res.json({ article: finalArticle.toJSON() }))
        .catch(next);

  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    Articles.find()
      .sort({ createdAt: 'descending' })
      .then((articles) => res.json({ articles: articles.map(article => article.toJSON()) }))
      .catch(next);
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.param('id', (req, res, next, id) => {
  return Articles.findById(id, (err, article) => {
    if(err) {
      return res.sendStatus(404);
    } else if(article) {
      req.article = article;
      return next();
    }
  }).catch(next);
});

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var token = getToken(req.headers);
  if(token) {
    return res.json({
      article: req.article.toJSON(),
    });    
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.patch('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var token = getToken(req.headers);
  if(token) {
    const { body } = req;

    if(typeof body.title !== 'undefined') {
      req.article.title = body.title;
    }

    if(typeof body.author !== 'undefined') {
      req.article.author = body.author;
    }

    if(typeof body.body !== 'undefined') {
      req.article.body = body.body;
    }

    return req.article.save()
      .then(() => res.json({ article: req.article.toJSON() }))
      .catch(next);
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});  
  }
});


router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var token = getToken(req.headers);
  if(token) {
    return Articles.findByIdAndRemove(req.params.id)
      .then(() => res.sendStatus(200))
      .catch(next);
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});   
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;