const flash = require('connect-flash');
const passport = require('passport');
const register = require('express').Router();
var expressValidator = require('express-validator');
const bcrypt = require('bcrypt');

const saltRounds = 10;

let errors = "";


register.route('/').get((req,res)=>{
	res.render('register.ejs', {
		title: "Register",
		errors: errors
	});
});

register.post('/users', function(req, res, next){

	req.checkBody('username', 'Username cannot be empty').notEmpty();
	req.checkBody('username', 'Username must be 8 to 15 characters long').len(8,15);
	req.checkBody('password', 'Password must be 8-15 characters long').len(8,15);
	req.checkBody('confirmPasswd', 'Passwords must match').equals(req.body.password);

	const errors = req.validationErrors();

	if(errors){
		console.log(`errors: ${JSON.stringify(errors)}`);

		console.log(`errors: ${JSON.stringify(errors[1].msg)}`);

		res.render('register.ejs', {
			title: 'Registration Error!',
			errors: errors
	});
	}else {
		const username = req.body.username;
		const password = req.body.password;

		db = require('../models/pools');
			var newUserMysql = {
					username: username,
					password: bcrypt.hashSync(password, 10)
				}

		
			db.query('INSERT INTO users (username, password) VALUES (?, ?)', [newUserMysql.username, newUserMysql.password], 
				function(err, results, fields){
			if(err){
				console.log(err);
				return;
			}

			db.query('SELECT LAST_INSERT_ID() as user_id', function(err, results, fields){
				if(err){
					console.log(err);
					return;
				}
				const user_id = results[0];
				console.log(results[0]);

				req.login(user_id, function(err){
					res.redirect('/dashboard');
				});
				res.render("register.html", {title: 'registration complete'});
			})	
			});	
	}
});

passport.serializeUser(function(user_id, done){
	return done(null, user_id);
});

passport.deserializeUser(function(user_id, done){
		return done(null, user_id);
});


module.exports = register;