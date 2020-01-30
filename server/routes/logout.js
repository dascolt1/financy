const passport = require('passport');
const logout = require('express').Router();
const flash = require('connect-flash');

logout.route('/').get((req,res)=>{
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

module.exports = logout;