var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/attendancetracker');

module.exports ={mongoose};