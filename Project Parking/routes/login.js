const route = require('express').Router();
var flash = require('connect-flash');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../db');

route.get('/login',function(req, res){
    res.render('login');
})

passport.use(new Strategy(
  function(username, password, cb) {
    db.findByUsername(username, function(err, user) {
      if (err){ 
        return cb(err);
      }
      if (!user){
         return cb(null, false);
         }
      if(user[0].Password == password){
         return cb(null, user); 
        }
      return cb(null, false);
    });
  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user[0].Password);
  });
  
  passport.deserializeUser(function(user, cb) {
      cb(null, user);
  });

route.post('/login',
passport.authenticate('local', { failureRedirect: '/login',  failureFlash: 'Invalid username and Password'}), 
function(req, res){
  //req.flash('user_name',req.body.username);
  
   res.redirect('/');
   //res.render('index',{user_name: req.body.username});
});

route.get('/logout',function(req, res){
    req.logout();
    res.redirect('/');
  });
module.exports = route