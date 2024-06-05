const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!!'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false, // will not show on any output
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      //this only works on create and save !!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'password are not the same !!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
//so a pre-middleware on save, all right? And the reason why we're doing it like this is that the middleware function that we're gonna specify here, so the encryption, is then gonna be happened between the moment that we receive that data and the moment where it's actually persisted to the database, okay? So that's where the pre-save middleware runs. Between getting the data and saving it to the database. And so that's the perfect time to manipulate the data.
userSchema.pre('save', async function (next) {
  //only run this func if password was actually modified
  if (!this.isModified('password')) return next(); //this is the current user who wantt to update the password
  //we use the bcrypt hashing algo for encryption So this algorithm will first salt then hash our password in order to make it really strong to protect it against bruteforce attacks
  //has the password with cost of 12
  //power of salting the pass before hashing it
  this.password = await bcrypt.hash(this.password, 12); //encrypt the password by bcrypt
  // https://www.youtube.com/watch?v=qgpsIBLvrGY ( to understand about password storage)
  //delete passworcconfirm field
  this.passwordConfirm = undefined; //not required for persistence to the database basically delete the field, so not to be persisted in the database is to set it to undefined.so after this validation was successful, we actually no longer need this field so we really do not want to persist it to the database. And so that's why we simply set it here to undefined.
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
//something will happend before the findupdate delete query
userSchema.pre(/^find/, function (next) {
  //find the maching string start with find
  //this is used for current query/user
  this.find({ active: { $ne: false } }); //so all user which is not equal to false show up only
  next();
});
//to verify the user password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}; //userpassowrd is hashed and candidatepassword is to check whether the login user is put correct password or not. it iwll return true and false

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); //send to user to create new real password
  this.passwordResetToken = crypto //store encrypt version in db
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //ms
  return resetToken; //send the unencrypt reset token to email
};
const User = mongoose.model('User', userSchema);
module.exports = User;
//always encrpt passwords then save to db- encryption should do on model not on controller

//verify the password without storing the actual password using hashing

//jwt tokens is the sol for authentication
