var express = require('express');
var router = express.Router();
var login = require("../login");
var scraper=require('../scrapper');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/login',function(req,res,next){
var details={
  username:req.body.regno,
  password:req.body.passwd
}

 login.doLogin(details,function (jar){
   scraper.scrape(jar,function(data){
     console.log(data);
   });
   res.render('slots');
 });

});

module.exports = router;
