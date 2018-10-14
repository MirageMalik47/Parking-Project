const route = require('express').Router();

route.get('/contact', function(req, res){
    res.render('contact');
});
module.exports = route