const tourController = require('../controllers/tourController');
const express = require('express');

const tourRouter = express.Router();

//tourRouter.param('id', tourController.checkID); ////param middleware  all the middlwware put into stack and exec one by one ...
//also in this way we can do //param middleware - run middleware functions based on specific parameters in the URL

tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours); //first aliastoptour works then getalltours works

tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
//params - variables after /:id are params
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
