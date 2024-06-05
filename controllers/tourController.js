//const fs = require('fs');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

//this below file need for testing purpose before connecting the database.
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
////param middleware
// exports.checkID = (req, res, next, val) => {
//   console.log(`tour id is :${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'invalid id' });
//   }
//   next(); //moves to next middleware to check
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price ',
//     });
//   }
//   next();
// };
//Aliasing 100
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverages,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // console.log(req.requestTime);

  console.log(req.query);

  //making api better :filter method
  //build the query
  // 1A) Filtering
  // const queryObj = { ...req.query }; //new object that contain all the key value pair that were there in query obj
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // //1B) Advance Filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //matching and repalce menthod accept callback
  // console.log(JSON.parse(queryStr));
  // //{difficulty :'easy,duration:{$gte:5}}
  // //gt gte lte lt
  // let query = Tour.find(JSON.parse(queryStr));

  // 2)Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' '); //first split the variable by comma then join it by space
  //   console.log(sortBy);
  //   query = query.sort(sortBy);
  //   //sort('price ratingsaverage')
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // 3) Field Limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  //4) Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // //page=3&limit=10 , 1-10, page 1, 11-20, page 2, 21-30 page 3
  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('this page does not exist');
  // }

  //execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .Paginate(); //chain methods
  const tours = await features.query;
  //const tours = await query;
  //query.sort().select().skip().limit()

  // const tours = await tour
  //   .find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');

  //send the response

  res.status(200).json({
    status: 'success',

    results: tours.length,
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that id', 404));
  }
  res.status(200).json({ status: 'success', data: { tour } });

  // console.log(req.params); // {id:'24'}
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // //   if (id > tours.length) {
  // // if (!tour) {
  // //   return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  // // }
  // res.status(200).json({ status: 'success', data: { tour } });
});
//in order to get rid our try catch blocks, we simply wrapped our asynchronous function inside of the catchAsync function that we just created. This function will then return a new anonymous function, which is this one here, which will then be assigned to createTour.

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',

    data: { tour: newTour },
  });
  // console.log(req.body);
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   './dev-data/data/tours-simple.json',
  //   JSON.stringify(tours), // JSON.stringify() static method converts a JavaScript value to a JSON string,
  //   //console.log(JSON.stringify({ x: 5, y: 6 }));
  //   // Expected output: '{"x":5,"y":6}'
  //   (err) => {

  // try {
  // const newTour = await Tour.create(req.body);
  // res.status(201).json({
  //   status: 'success',

  //   data: { tour: newTour },
  // });
  // } catch (err) {
  //   res.status(400).json({ status: 'fail', message: err });
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({ status: 'fail', message: 'invalid id' });
  // }

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that id', 404));
  }
  res.status(200).json({
    status: 'success',

    data: { tour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({ status: 'fail', message: 'invalid id' });
  // }

  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that id', 404));
  }
  res.status(204).json({ status: 'success', data: null });
});

//Aggregation pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } }, //used to filter certain documents
    {
      $group: {
        // _id: '$ratingsAverage', //used to tell what we are going to group by
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrince: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
    // { $match: { _id: { $ne: 'EASY' } } },
  ]);

  res.status(200).json({ status: 'success', data: stats });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' }, //The $unwind operator in MongoDB is used to deconstruct an array field into multiple documents. It creates a new document for each element in the array, effectively "unwinding" the array
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } }, //to get rid of id we use project use 0 || 1 to show the id
    { $sort: { numTourStarts: -1 } }, //sort by descending
    { $limit: 3 },
  ]);

  res.status(200).json({ status: 'success', data: plan });
});
