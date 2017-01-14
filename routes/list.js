var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    if (req.app.locals.referral == null) {
        res.redirect("index");
    }
    if (!(typeof req.app.locals.free_student == "string")) {
        var ar = [];
        for (var i = 0; i < req.app.locals.free_student.length; i++) {
            ar.push(req.app.locals.free_student[i]);
        }
    }
    else {
        var ar = [];
        ar.push(req.app.locals.free_student);
    }
    // console.log(ar);
    res.render('list', { free_student: ar });
});

module.exports = router;