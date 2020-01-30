var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
let session = require('express-session');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var bcrypt = require('bcrypt');
require('dotenv').config();


var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var profile = require('./routes/profile');
var stocks = require('./routes/stocks');
var budget = require('./routes/budget');
var goals = require('./routes/goals');
var logout = require('./routes/logout');

var app = express();

var port = process.env.PORT || 3000 ;
const ASSET_PATH = '/Users/tommydascoli/Desktop/programming/financeapp/assets';

app.use(express.json());

app.listen(port, function(){
	console.log(`listening on port ${port}`);
});

//template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

//have to use direct path since it is in different directory
app.use("/assets", express.static(ASSET_PATH));


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());

//authentication packs
app.use(flash());
app.use(cookieParser());


var options = {
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'financeapp'
};

var sessionStore = new MySQLStore(options);

app.use(session({ secret: 'jubmfoJE0R', 
	resave: false, 
	saveUninitialized: false,
	store: sessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/", index);
app.use('/login', login);
app.use('/register', register);
app.use('/dashboard', profile);
app.use('/stocks', stocks);
app.use('/budget', budget);
app.use('/goals', goals);
app.use('/logout', logout);

passport.use(new LocalStrategy(
  function(username, password, done) {

    	db = require('./models/pools');

    	db.query('SELECT id,password FROM users WHERE username = ?', [username], function(err, results, fields){
    		if(err){
    			 console.log(err); 
    			 return;
    		}

    		if(results.length == 0){
    			done(null, false);
    		}else {
    			const hash = results[0].password.toString();

	    		bcrypt.compare(password, hash, function(err, response){
	    			if(response === true){
	    				return done(null, {user_id: results[0].id});
	    			}else {
	    				return done(null, false);
	    			}
	    		});
    		}
    		
    	});
    }
));

// Handle 404
app.use(function(req, res) {
  res.status(404);
  res.render('error.html');
});

// Handle 500
app.use(function(error, req, res, next) {
  res.send('500: Internal Server Error', 500);
});
