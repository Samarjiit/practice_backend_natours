const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// mongoose
//   .connect(
//     'mongodb+srv://samar:12345@backendnatours.30pvbiv.mongodb.net/natours_database'
//   )
//   .then((con) => {
//     console.log('db connection successful!!'); //console.log(con.connections);
//   });
const DB = process.env.DATABASEE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {}).then((con) => {
  console.log('db connection successful!!'); //console.log(con.connections);
});

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'a tour must have a name'],
//     unique: true,
//   },
//   rating: { type: Number, default: 4.5 },
//   price: {
//     type: Number,
//     required: [true, ' A tour must have a price'],
//   },
// });

// const Tour = mongoose.model('Tour', tourSchema);
// //creating a new data and store it in the database

// const testTour = new Tour({
//   name: 'the forest gumpu',
//   rating: 4.78,
//   price: 4586,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('error:', err);
//   });
//console.log(process.env);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
//save 