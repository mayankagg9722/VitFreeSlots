var express = require('express');
var router = express.Router();
var login = require("../login");
var scraper = require('../scrapper');
var mongo = require('mongodb');
var bcrypt = require('bcrypt');
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/slots', function (req, res, next) {
  var details = {
    username: req.body.regno,
    password: req.body.passwd
  }

  login.doLogin(details, function (jar) {

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.passwd, salt, function (err, hash) {
        // console.log(hash);
        var item = {
          username: req.body.regno,
          password: hash
        }
        mongo.connect(url, function (err, db) {
          assert.equal(null, err);
          // console.log(item);
          db.collection("vitfreeslot").count({ username: item.username }, function (err, data) {
            // console.log(data);
            if (data == 0) {
              db.collection('vitfreeslot_users').insert(item, function (err, result) {
                assert.equal(null, err);
                console.log('item inserted');
              });
              scraper.scrape(jar, function (data) {
                // console.log(data);
                db.collection('vitfreeslot_users_information').insert(data, function (err, result) {
                assert.equal(null, err);
                console.log('item 2 inserted');
                db.close();
              });
              });
            }
            else {
              console.log("Already Added");
            }
          });
        });
      });
    });



    res.render('slots');
  });

});



module.exports = router;
