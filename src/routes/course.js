const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const mid = require('../middleware/authentication');
const {Course} = require('./../models/course');
const {Review} = require('./../models/review');

router.use(bodyParser.json());

router.param('courseId', function(req, res, next, id) {
	Course.findById(req.params.courseId, function(err, doc) {
	  if(err) return next(err);
	  if(!doc) {
		err = new Error();
		err.message = 'Not Found';
		err.status = 404;
		return next(err);
	  }
	  req.course = doc;
	  return next();
	})
	.populate('user reviews');
  });


// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get('/', function(req, res, next) {
	Course.find({}, 'course_id title')
				  .exec(function(err, courses){
					  if(err) return next(err);
			res.status(200);
					  res.json(courses);
				});
  });
  
  // GET /api/courses/:courseId 200 - Returns all Course properties and related user and review documents for the provided course ID
  router.get('/:courseId', function(req, res, next) {
	res.json(req.course);
  });
  
  // POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
  router.post('/', mid.authentication, function(req, res, next) {
	var course = new Course(req.body);
	course.save(function(err, course) {
	  if(err) return res.json(err);
	  res.status(201);
	  res.location('/courses').json();
	});
  });
  
  // PUT /api/courses/:courseId 204 - Updates a course and returns no content
  router.put('/:courseId', mid.authentication, function(req, res, next) {
	req.course.update(req.body, function(err, result) {
	  if(err) return res.json(err);
	  res.status(204).json();
	});
  });
  
  // POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
  router.post('/:courseId/reviews', mid.authentication,   function(req, res, next) {
	req.course.reviews.push(req.body);
	req.course.save(function(err, course) {
	  if(err) return res.json(err);
	  res.status(201);
	  res.location('/:courseId').json();
	});
  });

module.exports = router;
