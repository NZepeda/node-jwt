var express = require('express');
var router = express.Router();
var User = require('./models/user');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config/main');

router.get('/', (req, res) => {
    res.send('This is just here for testing');
});

// The Restritation Route
// Takes email and pasword
router.post('/api/v1/register', (req, res) => {

    if(!req.body.email || !req.body.password){
        console.log(req.body);
        res.json({success: false, message: 'Please include all data'});
    }
    else{
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });

        newUser.save((err) => {
            if(err) {

                return res.json({success: false, message: 'Email already exists'});
            }
            else{
                res.json({success: true, message: 'Successfully created the user'});
            }
        });
    }
});

// Authetication Route
// Handles giving out the token based on whether
// user successfully authenticated or not
router.post('/api/v1/authenticate', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            throw err;
        }
        if(!user){
            res.send({success: false, message: 'Authentication failed! User not found'});
        } else{
            // Check if the password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if(isMatch && !err){
                    // Create the token
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 3600 // time in seconds (1 hour)
                    });

                    res.json({success: true, token: 'JWT ' + token});
                }
                else{
                    console.log(err);
                    res.send({success: false, message: 'Authentication failed: Password didn\'t match'});
                }
            });
        }
    });
});

// Random protected route to test
router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('User id is: ' + req.user._id);
});

module.exports = router;
