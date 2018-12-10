var express = require('express');
var router = express.Router();
var date = require('date-and-time');

var User = require('../models/user');



/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  var now = new Date();
  res.render('index', { 
  	title: 'Attendance',
  	heading: 'Attendance Member Area',
  	currentDate: date.format(now, 'ddd MMM DD YYYY'),   
    currentTime: date.format(now, 'hh:mm A [GMT]Z')    
});
});


// post attendance timing

// router.post('/attendancetrack', function(req, res, next){

// var CurrentDate= req.body.CurrentDate;
// var CurrentTime= req.body.CurrentTime;

// //form validator
//  req.checkBody('CurrentDate','currentdate').notEmpty();
//  req.checkBody('CurrentTime','currenttime').notEmpty();

//  //check Errors
//  var errors = req.validationErrors();

// if(errors){
//     req.session.errors = errors;
//       req.session.success = false;
//       res.redirect('/index');
//   console.log('Errors');
// } else{
//     var _newAttendancetrack = new attendance({
//       CurrentDate: CurrentDate,
//       CurrentTime: CurrentTime
//     }); 
//     attendance.AttendanceInTime(_newAttendancetrack,function(err, AttendanceTrack) {
//       if(err) throw err;
//       console.log(AttendanceTrack);
//     });
     
  
//    // res.redirect('/');
//   //  req.session.success = true;
//     res.location('/'); 
//     res.redirect('/');
//    //console.log('No errors');
// }

// });

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
  	return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
