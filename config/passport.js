var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../app/models/user');
var config = require('../config/main');

module.exports = (passport) => {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        User.findOne({id: jwt_payload._id}, (err, user) => {

            if(err) {
                return done(err, false)
            }

            // This is a callback, if the user exits return it
            if(user){
                done(null, user);    
            }else{
                done(null, false);
            }
        });
    }));
}
