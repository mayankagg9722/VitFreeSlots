var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var voucher_codes = require('voucher-code-generator');
var mongo = require('mongodb');
var assert = require('assert');
require('dotenv').config();
var url = process.env.MONGO_URL;
/* GET users listing. */

router.get('/', function (req, res, next) {
    res.render('referral');
});

router.post('/mail', function (req, res, next) {
    // console.log(req.body);

     if (req.body.club_name == "" || req.body.club_name == "") {
    res.render("referral", { message: "Blank Fields" });
  }else{
    var transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vitfreeslots@gmail.com',
            pass: process.env.GMAIL_PASSWORD
        }
    });
    var code = generateCode();
    // console.log(code);
    var mailOptions = {
        from: 'FreeSlots <vitfreeslots@gmail.com>',
        to: req.body.email,
        subject: 'Test',
        text: 'U have got a new User',
        html: "<div style='width:100%; background-color:#004D40;padding:20px;color:white'><center><h1>VitFreeSlots</h1><p>Club:" + req.body.club_name + "</p>Referral Code:" + code[0] + "</p></center></div>"
    };


    transport.sendMail(mailOptions, function (error, info) {
        if (!error) {
            mongo.connect(url.toString(), function (err, db) {
                assert.equal(null, err);
                var item = {
                    club_name: req.body.club_name,
                    referral: code[0]
                }
                db.collection('vitfreeslot_referral').insert(item, function (err, result) {
                    assert.equal(null, err);
                    console.log('referral inserted');
                });
            });
            res.redirect('/index');
        }
    });
}
});

function generateCode() {
    code = voucher_codes.generate({
        length: 6,
        count: 1
    });

    return code;
}

module.exports = router;