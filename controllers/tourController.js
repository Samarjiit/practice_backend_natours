const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
////param middleware
exports.checkID = (req, res, next, val) => {
  console.log(`tour id is :${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'invalid id' });
  }
  next(); //moves to next middleware to check
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price ',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params); // {id:'24'}
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  //   if (id > tours.length) {
  // if (!tour) {
  //   return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  // }
  res.status(200).json({ status: 'success', data: { tour } });
};
exports.createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours), // JSON.stringify() static method converts a JavaScript value to a JSON string,
    //console.log(JSON.stringify({ x: 5, y: 6 }));
    // Expected output: '{"x":5,"y":6}'
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

exports.updateTour = (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({ status: 'fail', message: 'invalid id' });
  // }

  res
    .status(200)
    .json({ status: 'success', data: { tour: '<updated tour here....>' } });
};

exports.deleteTour = (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({ status: 'fail', message: 'invalid id' });
  // }

  res.status(204).json({ status: 'success', data: null });
};
