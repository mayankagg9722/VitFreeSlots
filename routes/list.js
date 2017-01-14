var express = require('express');
var router = express.Router();
var ar=[];
router.get('/', function (req, res, next) {
    if(!(typeof req.app.locals.free_student=="string")){
    for(var i=0;i<req.app.locals.free_student.length;i++){
         ar.push(req.app.locals.free_student[i]);
    }
    }
    else{
        
        ar.push(req.app.locals.free_student);
    }
    // console.log(ar);
    res.render('list',{free_student:ar});
});

module.exports = router;