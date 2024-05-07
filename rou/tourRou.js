const tourController = require('../controllers/tourController');
const express = require('express');

const tourRouter = express.Router();

tourRouter.param('id', tourController.checkID); ////param middleware  all the middlwware put into stack and exec one by one ...
//also in this way we can do //param middleware - run middleware functions based on specific parameters in the URL
tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
//params - variables after /:id are params
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
