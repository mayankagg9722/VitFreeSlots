var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    if (req.app.locals.referral == null) {
        res.redirect("index");
    }
    else{
        if (!(typeof req.app.locals.free_student == "string")) {
        var ar = [];
        if (req.app.locals.free_student[0] == undefined) {
            // ar.push("");
            res.render('list', { free_student: ["No Members Free"] });

        } else {
            for (var i = 0; i < req.app.locals.free_student.length; i++) {
                ar.push(req.app.locals.free_student[i]);
            }
            res.render('list', { free_student: ar });
        }
    }
    else {
        var ar = [];
        if (req.app.locals.free_student[0] == undefined) {
            ar.push("No Members Free");
        } else {
            ar.push(req.app.locals.free_student);
        }
        res.render('list', { free_student: ar });
    }
    }
});

module.exports = router;