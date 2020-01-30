const budget = require('express').Router();
const passport = require('passport');

budget.get("/", authenticationMiddleware(),function(req, res){
	res.send('budget route');
});

function authenticationMiddleware(){
	return (req, res, next) => {

		if(req.isAuthenticated()) return next();

		res.redirect('/login');
	}
}



module.exports = budget;