var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
/* GET users listing. */
 var memberNames=new Array;
router.get('/', function (req, res, next) {
  MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
    var col = db.collection("vitfreeslot_users_information");
    col.find().toArray(function (err, items) {
      for (var i = 0; i < items.length; i++) {
        // console.log(items[i].name.student_name);
        memberNames.push(items[i].name.student_name);
      }
      //  console.log(memberNames);
       res.render('slots',{memberNames:memberNames});
    });   
  });
  
});

router.post('/find', function (req, res, next) {
  res.json(req.body);
  var day = req.body.day;
  var index;
  if (day == 'MON') index = 0;
  if (day == 'TUE') index = 1;
  if (day == 'WED') index = 2;
  if (day == 'THU') index = 3;
  if (day == 'FRI') index = 4;

  MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
    var col = db.collection("vitfreeslot_users_information");
    col.find().toArray(function (err, items) {
      // console.log(items.length);
      for (var i = 0; i < items.length; i++) {
        var time = req.body.time;
        if (typeof time === "string") {
          var tt = [];
          tt.push(req.body.time);
          if (tt.every(function (val) { return items[i].time[index][day].indexOf(val) >= 0; })) {
            console.log(items[i].name.student_name);
          }
        } else {
          if (time.every(function (val) { return items[i].time[index][day].indexOf(val) >= 0; })) {
            console.log(items[i].name.student_name);
          }
        }
      }
    });
  });
});


module.exports = router;
