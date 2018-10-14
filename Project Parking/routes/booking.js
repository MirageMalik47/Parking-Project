const route = require('express').Router();
const mysql = require('mysql2');

route.get('/booking', function(req, res){
    res.render('booking');
});

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'parking',
    user: 'root',
    password: 'suryabhai42'
});

route.post('/booking', function(req, res){
    var place = req.body.place1;
    var vehicle = req.body.vehicle1;
    var date = req.body.date1;
    var time = req.body.time1;
 
    connection.query('SELECT * FROM booking WHERE vehicle = ?',[vehicle], function (error, results, fields) {
            if (error) {
              res.send({
                "code":400,
                "failed":"error ocurred from database"
              })
            }
            else{
              if(results.length >0){
                 // req.flash('error_msg','Booking already exists');
                  res.redirect('/index');
              }
              else{
                var booking={
                    
                     "place" : req.body.place1,
                     "vehicle" : req.body.vehicle1,
                     "date" : req.body.date1,
                     "time": req.body.time1,
                }
                connection.query('INSERT INTO booking SET ?',booking, function (error, results, fields) {
                if (error) {
                    console.log("error ocurred",error);
                    res.send({
                    "code":400,
                    "failed":"error ocurred"
                    })
                }
                else{
                   // console.log('The solution is: ', results);
                   // req.flash('success_msg','You have sucessfully signed up');
                    res.redirect('/booking');
                }
             });
            }
        }
     });
});
module.exports = route