const express = require('express');
const bp = require('body-parser');
const path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
const nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const app = express();
 
const SERVER_PORT = process.env.PORT || 4996;

//body parser
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

//View engine
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({default:'index'}));
app.set('views', path.join(__dirname, 'views'));

// BodyParser Middleware
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));
  
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.book_error = req.flash('book_error');
    res.locals.user_name = req.flash('user_name');
    res.locals.user = req.user || null;
    next();
}); 

app.use('/', require('./routes/index'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/signup'));
app.use('/', require('./routes/contact'));
app.use('/', require('./routes/about'));
app.use('/', require('./routes/booking'));


//Nodemailer(Contact)
app.post('/send', (req, res) => {
    const output = `
        <p>you have a new contact request</p>
        <h3>contact details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'sarangchoudhary1996@gmail.com', // generated ethereal user
            pass: 'umesh12345' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Priority Parking" <sarangchoudhary1996@gmail.com>', // sender address
        to: 'sarangchoudhary@yahoo.com', // list of receivers
        subject: 'Parking request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
       // app.use('/', require('./routes/index'));
        res.render('contact', {msg: 'Email has been sent'});
    });
})


app.listen(SERVER_PORT,function(){
    console.log('http://localhost:4996');
})