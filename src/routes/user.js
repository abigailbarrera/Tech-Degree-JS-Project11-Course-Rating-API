const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const mid = require('../middleware/authentication');
const {User} = require('./../models/user');

router.use(bodyParser.json());


// This will return the currently authenticated user. Authentication

router.get('/users', mid.authentication, function(req, res, next) {
    res.status(200);
    res.json(req.authenticatedUser);
});


// This will add a new user to the database using the POST method before

router.post('/users', function(req, res, next) {
	User.findOne({ emailAddress: req.body.emailAddress })
		.exec(function(error, user) {
		  if(error) return next(error);
		  if(user) {
			var err = new Error();
			err.message = 'User email address already exists in database.';
			err.status = 401;
			return next(err);
		  } else {
			User.create(req.body, function (err, user) {
			  if (err) {
				return res.json(err);
			  } else {
				res.location('/');
				res.status(201);
				res.end();
			  };
			});
		  };
	  });
  });

module.exports = router;
