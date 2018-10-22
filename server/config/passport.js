var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/User');
var settings = require('../config/settings');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = settings.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      console.log(jwt_payload);
      User.findOne({_id: jwt_payload._id}, function(err, user) {
        console.log("finding user");
            if (err) {
                return done(err, false);
            }
            if (user) {
                console.log("found user");
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
  };