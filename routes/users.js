var express = require('express');
var router = express.Router();
var session = require('express-session');
var multer = require('multer');
var upload =multer({dest: './uploads'});
var expressValidator=require('express-validator'); 
var flash = require('connect-flash');
var passport = require('passport');
var date = require('date-and-time');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var attendanceIN = require('../models/attendance');
var attendanceOUT = require('../models/attendance');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
 // res.render('register',{pageTitle:'Register'});
  res.render('register', { success: req.session.success, errors: req.session.errors });
   req.session.errors = null;
});

var now = new Date();
currentDate= date.format(now, 'ddd MMM DD YYYY');   
currentTime= date.format(now, 'hh:mm A [GMT]Z');

router.get('/login', function(req, res, next) {
  res.render('login',{pageTitle:'Login'});
});

var now = new Date();
router.post("/login",
 passport.authenticate('local',{failurRedirect:'/users/login', failureFlash: 'invalid username or password'}),
 function(req,res){
 var _newAttendancetrack = new attendanceIN({
 currentDate: date.format(now, 'ddd MMM DD YYYY'),   
  currentTime: date.format(now, 'hh:mm A [GMT]Z'),
    });
    attendanceIN.AttendanceInTime(_newAttendancetrack,function(err, AttendanceTrack) {
      if(err) throw err;
      console.log(AttendanceTrack);   
    });  
  req.flash('success','you are now login in');
  res.redirect('/');
 });

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
      done(err,user);
  });
});

 passport.use(new LocalStrategy(function(username,password,done){
   User.getUserByUsername(username, function(err,user){
    if(err) throw err;
    if(!user){ 
      return done(null,false, {message: 'unknown User'});
    }
    User.comparePassword(password, user.password,function(err, isMatch){
     if(err) return done(err);
     if(isMatch){
      return done(null, user);
     }else {
      return done(null, false,{message: 'Invalid Password'});
     }
    });
   });
  })); 

 router.post('/register', upload.single('profileimage'),function(req, res, next) {
 var username= req.body.username;
 var email= req.body.email;
 var password= req.body.password;
 // var confirmpassword= req.body.confirmpassword;
 //console.log(req.file);

 if(req.file)
 {
 	console.log('uploading file...');
 	var profileimage = req.file.filename;

 }else
 {
 	console.log('no file ...');
 	var profileimage = 'no image';
 }

 //form validator
 req.checkBody('username','username is required').notEmpty();
 req.checkBody('email','Email is required').notEmpty();
 req.checkBody('email','email is not valid').isEmail();
 req.checkBody('password','password is required').notEmpty();
 // req.checkBody('confirmpassword','password do not match').equals(req.body.password);

//check Errors
 var errors = req.validationErrors();

if(errors){
	  req.session.errors = errors;
      req.session.success = false;
      res.redirect('/users/register');
	console.log('Errors');
} else{
    var newUser = new User({
    	username: username,
    	email: email,
    	password: password,
    	profileimage: profileimage
    });	
    User.createUser(newUser,function(err, user) {
    	if(err) throw err;
    	console.log(user);
    });
     
  
   // res.redirect('/');
    req.session.success = true;
    res.location('/'); 
    res.redirect('/');
   console.log('No errors');
}
 });

//var now1 = new Date();
router.post('/logout', function(req, res){
  
// var _newAttendancetrack = new attendanceOUT({
//  currentDate: date.format(now1, 'ddd MMM DD YYYY'),   
//   currentTime: date.format(now1, 'hh:mm A [GMT]Z')
//     }); 
//     attendanceOUT.AttendanceOutTime(_newAttendancetrack,function(err, AttendanceTrack) {
//       if(err) throw err;
//       console.log(AttendanceTrack);
//     });
//   req.logout();
  req.flash('success','you are now logout');
  res.redirect('/users/login');
   
console.log("logout");
});


module.exports = router;
