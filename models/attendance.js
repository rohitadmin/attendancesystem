var {mongoose}= require('./db')

var db = mongoose.connection;


var AttendanceIN = mongoose.Schema({
 currentDate: {
	type: String,
    index: true
},
currentTime: {
	type: String 
},

});


var AttendanceIn = module.exports = mongoose.model('AttendanceIn',AttendanceIN);


module.exports.AttendanceInTime = function(AttandanceTrackOne, callback){
	AttandanceTrackOne.save(callback);
}

