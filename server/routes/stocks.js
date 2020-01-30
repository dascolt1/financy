const stocks = require('express').Router();
const passport = require('passport');

stocks.get("/", authenticationMiddleware(),function(req, res){
	res.render('stocks.ejs');
});

function authenticationMiddleware(){
	return (req, res, next) => {

		if(req.isAuthenticated()) return next();

		res.redirect('/login');
	}
}



module.exports = stocks;