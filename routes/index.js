var express = require('express');
var router = express.Router();
var login = require("../login");
var scraper = require('../scrapper');
var mongo = require('mongodb');
var bcrypt = require('bcrypt');
var assert = require('assert');
var url = process.env.MONGO_URL;
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
  if (req.body.regno == "" || req.body.passwd == "") {
    res.render("index", { message: "Blank Fields" });
  } else {
    login.doLogin(details, function (jar) {
      if (jar == "Invalid Register No. or Password.") {
        res.render("index", { message: "Not a valid registartion number or password." });
      } else {
        checkReferral(req.body.referral, function (data) {
          // console.log(data);
          if (data != 0) {
            req.app.locals.referral = req.body.referral;
            // console.log(req.app.locals.referral);
            bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(req.body.passwd, salt, function (err, hash) {
                // console.log(hash);
                var item = {
                  username: req.body.regno,
                  password: hash,
                  referral: req.body.referral
                }
                mongoInsertion(item.username, item.referral, jar, item, req, function (data) {
                  if (data == "done") {
                    res.redirect('/slots');
                  } else {
                    console.log("not woking");
                  }
                });
              });
            });
          } else {
            res.render("index", { message: "Referral Not Valid" });
          }
        });
      }
    });
  }
});

function getCount(username, referral, callback) {
  mongo.connect(url.toString(), function (err, db) {
    db.collection("vitfreeslot_users").count({ username: username, referral: referral }, function (err, data) {
      callback(data);
    });
  });
}

function checkReferral(referral, callback) {
  mongo.connect(url.toString(), function (err, db) {
    db.collection("vitfreeslot_referral").count({ referral: referral }, function (err, data) {
      callback(data);
    });
  });
}

function mongoInsertion(username, referral, jar, item, req, callback) {
  mongo.connect(url.toString(), function (err, db) {
    assert.equal(null, err);
    // console.log(item);
    getCount(username, referral, function (res) {
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
            callback("done");
          });
        });
      }
      else {
        req.app.locals.referral = req.body.referral;
        // console.log(req.app.locals);
        console.log("Already Added");
        callback("done");
      }
    });
  });
}

module.exports = router;