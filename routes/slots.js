var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('slots');
});


router.post('/find',function(req,res,next){
res.json(req.body);
});


module.exports = router;
