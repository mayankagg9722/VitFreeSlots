var cheerio = require('cheerio');
var unirest = require('unirest');
var free_slots = new Object;
var global_callback;
var time = [];

function scrape(jar, callback) {
    global_callback = callback;
    var Request = unirest.get('https://vtop.vit.ac.in/student/course_regular.asp?sem=WS')
        .jar(jar)
        .followRedirect(true)
        .timeout(28000)
        .end(function (res) {
            if (res.error) {
                console.log('GET error', res.error)
            } else {
                console.log("///@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

                var Request = unirest.get('https://vtop.vit.ac.in/student/course_regular.asp?sem=WS')
                    .jar(jar)
                    .followRedirect(true)
                    .timeout(28000)
                    .end(slotScrapping)
            }

        });

    function getName(res) {
        // console.log(res.body);
        var $ = cheerio.load(res.body);
        tables = $('table');
        table = $(tables[3]);
        var name = table.find('tr').eq(1).find("td").eq(1).text().trim();
        // console.log(name);
        var obj = new Object;
        obj.student_name = name;
        free_slots.name = obj;
        console.log(free_slots);
        global_callback(free_slots);
    };

    //##########    "FREE  SLOTS(BY mayankagg9722)!!!!!!"

    function slotScrapping(res) {
        var $ = cheerio.load(res.body);
        tables = $('table');
        table = $(tables[2]);
        // console.log(table.text());
        for (var i = 2; i < 7; i++) {
            var obj = new Object;
            // obj.day = table.find('tr').eq(i).find('td').eq(0).text();
            // var str=table.find('tr').eq(i).find('td').eq(0).text();
            // console.log(str);
            var arr = [];
            for (var j = 0; j < table.find('tr').eq(i).find('td').length; j++) {
                if (table.find('tr').eq(i).find('td').eq(j).text().length < 11) {
                    if (j != 7 && !(table.find('tr').eq(0).find('td').eq(j).text() == "THEORY HOURS")) {
                        // console.log(table.find('tr').eq(0).find('td').eq(j).text());
                        if (table.find('tr').eq(0).find('td').eq(j).text().length > 3) {
                            arr.push(table.find('tr').eq(0).find('td').eq(j).text());
                        } else {
                            arr.push(table.find('tr').eq(1).find('td').eq(j).text());
                        }

                    }
                    var str=table.find('tr').eq(i).find('td').eq(0).text();
                    obj[str] = arr;
                }
            }
            time.push(obj);
        }
        free_slots.time = time;
        // console.log(free_slots);
        var Request = unirest.get('https://vtop.vit.ac.in/student/profile_personal_view.asp')
                    .jar(jar)
                    .followRedirect(true)
                    .timeout(28000)
                    .end(function (res) {
                        if (res.error) {
                            console.log('GET error', res.error)
                        } else {
                            var Request = unirest.get('https://vtop.vit.ac.in/student/profile_personal_view.asp')
                                .jar(jar)
                                .followRedirect(true)
                                .timeout(28000)
                                .end(getName)
                        }
                    });
    }
     
    //##########    "FREE  SLOTS(BY mayankagg9722)!!!!!!" 
}

exports.scrape = scrape;