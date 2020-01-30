const goals = require('express').Router();
const passport = require('passport');

goals.get("/", authenticationMiddleware(),function(req, res){
	res.send("goals route");
});

function authenticationMiddleware(){
	return (req, res, next) => {

		if(req.isAuthenticated()) return next();

		res.redirect('/login');
	}
}



module.exports = goals;