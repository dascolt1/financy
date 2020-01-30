const LocalStrategy = require("passport-local").Strategy;
const flash = require('flash');

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dbconfig = require('./database');
var connection = mysql.createConnection({
	host: "localhost",  
  	user: "root",  
  	password: "",
  	flags: '-MULTI_STATEMENTS'
});

connection.connect(function(err, connection) {  
  if (err) throw err;  
  if(connection){
 		console.log('connected');
 	} 
});

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		connection.query("SELECT * FROM users WHERE id = ? ", [id],
			function(err, rows){
				done(err, rows[0]);
			});
	});

	passport.use(
		'local-signup',
		new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallBack: true
		},
		function(user, pass, done){
			console.log(user + pass);
			connection.query("SELECT * FROM users WHERE username = ?", [user], function(err, rows){
				if(err){
					return done(err);
				}

				if(rows.length){
					return done(null, false, req.flash('signupMessage', "Username already taken"));
				}else {
					var newUserMysql = {
						username: user,
						password: bcrypt.hashSync(pass, 10)
					}

					console.log(newUserMysql);

					var insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";

					connection.query(insertQuery, [newUserMysql], function(err, rows){

						if(err){
							console.log('error ' + err);
						}

						newUserMysql.id = rows.insertId;
						return done(null, newUserMysql);
					});
				}
			});
		}));

	passport.use(
		'local-login',
		new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallBack: true
		},
		function(username, password, done){
			connection.query("SELECT * FROM users WHERE username = ?", [username],
				function(err, rows){
					if(err){
						return done(err);
					}

					if(!rows.length){
						return done(null, false);
					}

					if(!bcrypt.compareSync(password, rows[0].password)){
						return done(null, false);
					}

					return done(null, rows[0]);
				});
		}));
}