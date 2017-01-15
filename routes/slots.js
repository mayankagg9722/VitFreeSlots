var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var app = require("../app");

/* GET users listing. */
var memberNames = new Array;
router.get('/', function (req, res, next) {
  if(req.app.locals.referral==null){
    res.redirect("index");
  }
  console.log("s");
  getNames(req.app.locals.referral,function(data){
    res.render('slots', { memberNames: data });
  });
});

router.get('/logout', function (req, res, next) {
  req.app.locals.referral=null;
  res.redirect("/");
});

router.post('/find', function (req, res, next) {
  // res.json(req.body);
  var day = req.body.day;
  var free_student = new Array;
  var index;
  if (day == 'MON') index = 0;
  if (day == 'TUE') index = 1;
  if (day == 'WED') index = 2;
  if (day == 'THU') index = 3;
  if (day == 'FRI') index = 4;

  MongoClient.connect('mongodb://lakshay:lakshay@ds111559.mlab.com:11559/vitfreeslot', function (err, db) {
    var col = db.collection("vitfreeslot_users_information");
    col.find({referral:req.app.locals.referral}).toArray(function (err, items) {
      console.log(items);
      for (var i = 0; i < items.length; i++) {
        var time = req.body.time;
        if (typeof time === "string") {
          var tt = [];
          tt.push(req.body.time);
          if (tt.every(function (val) { return items[i].time[index][day].indexOf(val) >= 0; })) {
            console.log(items[i].name.student_name);
            free_student.push(items[i].name.student_name);
          }
        } else {
          if (time.every(function (val) { return items[i].time[index][day].indexOf(val) >= 0; })) {
            console.log(items[i].name.student_name); free_student.push(items[i].name.student_name);
          }
        }
      }
      req.app.locals.free_student = free_student;
      res.redirect("/list");
    });
  });
});

function getNames(referral,callback){
  console.log("f");
var memberNames=[];
  MongoClient.connect('mongodb://lakshay:lakshay@ds111559.mlab.com:11559/vitfreeslot', function (err, db) {
    var col = db.collection("vitfreeslot_users_information");
    col.find({referral:referral}).toArray(function (err, items) {
      for (var i = 0; i < items.length; i++) {
        // console.log(items[i].name.student_name);
        memberNames.push(items[i].name.student_name);
      }
      //  console.log(memberNames);
      callback(memberNames); 
    });
  });
}



module.exports = router;
