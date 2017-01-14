var express = require('express');
var router = express.Router();
var login = require("../login");
var scraper = require('../scrapper');
var mongo = require('mongodb');
var bcrypt = require('bcrypt');
var assert = require('assert');
// var expressValidator=require('express-validator');
// var MongoClient=requre('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/submit', function (req, res, next) {
  var details = {
    username: req.body.regno,
    password: req.body.passwd,
    referral: req.body.referral
  }
  console.log(req.body.passwd);
  if (req.body.regno == "" || req.body.passwd == "") {
    res.render("index", { message: "Blank Fields" });
  } else {
        login.doLogin(details, function (jar) {
    checkReferral(req.body.referral, function (data) {
      // console.log(data);
      if (data != 0) {
        req.app.locals.referral=req.body.referral;
        // console.log(req.app.locals.referral);
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.passwd, salt, function (err, hash) {
            // console.log(hash);
            var item = {
              username: req.body.regno,
              password: hash,
              referral: req.body.referral
            }
            mongo.connect(url, function (err, db) {
              assert.equal(null, err);
              // console.log(item);
              getCount(item.username, function (res) {
                // console.log(res);
                if (res == 0) {
                  db.collection('vitfreeslot_users').insert(item, function (err, result) {
                    assert.equal(null, err);
                    console.log('item inserted');
                  });
                  scraper.scrape(jar, function (data) {
                    // console.log(data);
                    data.referral = req.body.referral;
                    db.collection('vitfreeslot_users_information').insert(data, function (err, result) {
                      assert.equal(null, err);
                      console.log('item 2 inserted');
                    });
                  });
                }
                else {
                  req.app.locals.referral = req.body.referral;
                  // console.log(req.app.locals);
                  console.log("Already Added");
                }
              });
            });
          });
        });
        res.redirect('/slots');
      } else {
      res.render("index",{message:"Referral Not Valid"});
    }
    });
  });
  }


});

function getCount(username, callback) {
  mongo.connect(url, function (err, db) {
    db.collection("vitfreeslot_users").count({ username: username }, function (err, data) {
      callback(data);
    });
  });
}

function checkReferral(referral, callback) {
  mongo.connect(url, function (err, db) {
    db.collection("vitfreeslot_referral").count({ referral: referral }, function (err, data) {
      callback(data);
    });
  });
}

module.exports = router;