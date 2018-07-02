'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
const validator = require('validator');


var UserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: [true, 'Email address is required.'],
        unique: true,
        validate: {
            isAsync: false,
            validator: validator.isEmail,
                message: 'Not a valid email.'
        }
    },
    password: {
        type: String,
        required: true
    }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ emailAddress: email })
        .exec(function(err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                var error = new Error();
                err.message = 'User not found.';
                error.status = 401;
                return callback(error);
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if (res === true) {
                    return callback( null, user );
                } else {
                    return callback();
                }
            })
        });
}

// hash password before saving to database
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
        return next(err);
        }
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', UserSchema);

module.exports = User;