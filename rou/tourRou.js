const tourController = require('../controllers/tourController');
const express = require('express');
const authController = require('./../controllers/authController');
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
  .get(authController.protect, tourController.getAllTours) //so first protect wala runs if if has error than show error and it will not forward with next getalltours middleware
  .post(tourController.createTour);
//params - variables after /:id are params
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'), //now admin and lead-guide can delete the tours but not the normal guide and user
    tourController.deleteTour
  ); //check first whether adimin is already login if yes then check whether he is admin or not if yes then delete the tour

module.exports = tourRouter;
