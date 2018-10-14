const route = require('express').Router();
const mysql = require('mysql2');

route.get('/signup', function(req, res){
    res.render('signup');
});

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'parking',
    user: 'root',
    password: 'suryabhai42'
});

route.post('/signup', function(req, res){
    var Name = req.body.name;
    var Email = req.body.Email;
    var Password1 = req.body.password1;
    var Password2 = req.body.password2;
    var Phone_Number = req.body.Mobile;

    req.checkBody('Email', 'Enter a valid email address').isEmail();
    //req.checkBody('Password2', 'Passwords do not match').equals(req.body.password1);
   // req.checkBody('Password1', 'Password length should be atleast 8 characters long').isLength({min: 8, max: undefined});

    var errors = req.validationErrors();
    if(errors){
        res.render('signup', {
            errors: errors
        })
    }
    else{
        connection.query('SELECT * FROM users WHERE Email = ?',[Email], function (error, results, fields) {
            if (error) {
              res.send({
                "code":400,
                "failed":"error ocurred from database"
              })
            }
            else{
              if(results.length >0){
                  req.flash('error_msg','User already exists');
                  res.redirect('/signup');
              }
              else{
                var users={
                    "Name":req.body.name,
                    "Email":req.body.Email,
                    "Password":req.body.password1,
                    "Phone_Number":req.body.Mobile,
                }
                connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
                if (error) {
                    console.log("error ocurred",error);
                    res.send({
                    "code":400,
                    "failed":"error ocurred"
                    })
                }
                else{
                   // console.log('The solution is: ', results);
                    req.flash('success_msg','You have sucessfully signed up');
                    res.redirect('/login');
                }
             });
            }
        }
    });
    }
});
module.exports = route