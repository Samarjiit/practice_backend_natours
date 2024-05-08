//const fs = require('fs');
const Tour = require('./../models/tourModel');

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
exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);
  try {
    console.log(req.query);

    //making api better :filter method
    //build the query
    // 1A) Filtering
    const queryObj = { ...req.query }; //new object that contain all the key value pair that were there in query obj
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1B) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //matching and repalce menthod accept callback
    console.log(JSON.parse(queryStr));
    //{difficulty :'easy,duration:{$gte:5}}
    //gt gte lte lt
    let query = Tour.find(JSON.parse(queryStr));

    // 2)Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); //first split the variable by comma then join it by space
      console.log(sortBy);
      query = query.sort(sortBy);
      //sort('price ratingsaverage')
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //page=3&limit=10 , 1-10, page 1, 11-20, page 2, 21-30 page 3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('this page does not exist');
    }

    //execute the query
    const tours = await query;
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
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
  // console.log(req.params); // {id:'24'}
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // //   if (id > tours.length) {
  // // if (!tour) {
  // //   return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  // // }
  // res.status(200).json({ status: 'success', data: { tour } });
};
exports.createTour = async (req, res) => {
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

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',

      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({ status: 'fail', message: 'invalid id' });
  // }
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',

      data: { tour },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({ status: 'fail', message: 'invalid id' });
  // }
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
