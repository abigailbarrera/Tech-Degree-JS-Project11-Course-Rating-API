'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema

var CourseSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: {
        type: String
    },
    materialsNeeded: {
        type: String
    },
    steps: [
        {
            stepNumber: Number,
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;