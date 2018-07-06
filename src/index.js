'use strict';
//load modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const seeder = require('mongoose-seeder');

const courseRoutes = require('./routes/course');
const userRoutes = require('./routes/user');
const data = require('./data/data.json');


mongoose.connect('mongodb://localhost:27017/apidb')
  .then(function() {
      console.log('db connection successful');
      seeder.seed(data).then(function(dbData) {
          console.log('db has been seeded')
      }).catch(function(err) {
          console.log(err);
      });
  }, function(err) {
      console.error('connection error:', err);
  });

var db = mongoose.connection;

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

//set port
app.set('port', 5000);
//use morgan to log
app.use(morgan('dev'));


app.use('/', express.static('public'));


app.use(function(req, res, next) {
	var err = new Error();
	err.message = 'File Not Found';
	err.status = 404;
	next(err);
  });

//express global error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json(err);
  });

// Begin listenserver on port.

app.listen(app.get('port'), function() {
  	console.log('Server is now running at http://localhost:5000.');
})

module.exports = {app};
