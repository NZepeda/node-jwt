var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-Parser');
var morgan = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('./config/main');
var User = require('./app/models/user');

// Create routes
var router = require('./app/routes.js');
var port = process.env.port || 8000;

require('dotenv').config();
require('./config/passport')(passport);


mongoose.connect(config.database);

// Use body-parser to get data from requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(router);

app.listen(port, () => {
    console.log('App is now listening on port: ' + port);
});
