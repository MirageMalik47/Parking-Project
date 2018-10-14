const route = require('express').Router();

route.get('/about', function(req, res){
    res.render('about');
});
module.exports = route