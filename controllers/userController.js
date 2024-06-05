const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    //return all the field names using keys here el is the current field
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

////allow current login user to manipulate  current user data email and name // we use other way to update the password
exports.updateMe = catchAsync(async (req, res, next) => {
  //1 create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for password updates. please use /updatemypassword.',
        400
      )
    );
  }
  //2. filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  //3.update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

////Now when a user decides to delete his account, we actually do not delete that document from the database. But instead we actually just set the account to inactive. So that the user might at some point in the future reactivate the account and also so that we still can basically access the account in the future, even if officially, let's say it has been deleted.
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    // no additional information to send back in the response body 200 status code is used for most types of successful requests, while a 204 status code is used when the server has processed the request successfully, but there is no content to return to the client.
    status: 'success',
    data: null,
  });
});
exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'the route is not yet defined !!' });
};

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'the route is not yet defined !!' });
};
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'the route is not yet defined !!' });
};

exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'the route is not yet defined !!' });
};
