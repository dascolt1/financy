const passport = require('passport');
const login = require('express').Router();
const flash = require('connect-flash');

login.route('/').get((req,res)=>{
	res.render('login.ejs');
});

login.post('/users', passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/login',
	failureFlash: true
}));

module.exports = login;