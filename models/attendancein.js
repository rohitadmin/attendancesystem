var {mongoose}= require('./db')

var db = mongoose.connection;
var User = require('../models/user');

var AttendanceOUT = mongoose.Schema({
 currentDate: {
	type: String,
    index: true
},
currentTime: {
	type: String 
},
email:{
	type: String
},
username:{
	type:String
}

});

var AttendanceOut = module.exports = mongoose.model('AttendanceOut',AttendanceOUT);

module.exports.AttendanceOutTime = function(AttandanceTrackTwo, callback){
	AttandanceTrackTwo.save(callback);
}
