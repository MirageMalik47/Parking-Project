const mysql = require('mysql2');
var flash = require('connect-flash');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'parking',
    user: 'root',
    password: 'suryabhai42'
});

exports.findByUsername = function(username, cb) {
    connection.query('SELECT * FROM users WHERE Email = ?',[username], function (error, results, fields) {
        if (error) {
          res.send({
            "code":400,
            "failed":"error ocurred from database"
          })
        }
        else{
          if(results.length >0){
            return cb(null, results);
          }
          else{
            return cb(null, null);
              //req.flash('error', 'Invalid username');
              //res.redirect('/login');
          }
        }
     });
  }