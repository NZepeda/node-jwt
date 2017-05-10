var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-Parser');
var morgan = require('morgan'); 
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('./config/main');
var User = require('./app/models/user');
var port = process.env.port || 8000;

require('./config/passport')(passport);

mongoose.connect(config.database);

// Use body-parser to get data from requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Create routes
var router = express.Router();

router.post('/register', (req, res) => {
    console.log(req.body);
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
                console.log(err);
                return res.json({success: false, message: 'Email already exists'});
            }
            else{
                res.json({success: true, message: 'Successfully created the user'});
            }
        });
    }
});

router.post('/authenticate', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            throw err;
        }
        if(!user){
            res.send({success: false, message: 'Authentication failed! User not found'});
        } else{
            // Check if the password matches
            user.comparePassword(req.body.passpord, (err, isMatch)=> {
                if(isMatch && !err){
                    // Create the token
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 3600 // time in seconds (1 hour)
                    });

                    res.json({success: true, token: 'JWT' + token});
                }
                else{
                    res.send({success: false, message: 'Authentication failed: Password didn\'t match'});
                }
            });
        }
    });
});

// Random protected route to test
router.get('/dashboard', passport.authenticate('jwt', {session: 'false'}), (req, res) => {
    res.send('User id is: ' + req.user._id);
});

app.use('/api', router);


app.get('/', (req, res) => {
    res.send('This is just here for testing');
});

app.listen(port, () => {
    console.log('App is now listening on port: ' + port);
});