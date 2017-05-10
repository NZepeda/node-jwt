var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type : String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Client', 'Manager', 'Admin'],
        default: 'Client'
    }
});

// Save users hashed password
UserSchema.pre('save', (next) => {
    var user = this;
    console.log(this);
    
    if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {return next(err)}

            bcrypt.hash(user.password, salt, (err, hash)=> {
                if(err) {return next(err)}

                user.password = hash;
                next();
            });
        });
    } 
    else{
        return next();
    }
});

// Create method to compare password
UserSchema.methods.comparePassword = (pw, cb) => {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if(err) {return cb(err)}

        cb(null, isMatch);

    });
}

module.exports = mongoose.model('User', UserSchema);