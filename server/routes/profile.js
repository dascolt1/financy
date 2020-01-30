const profile = require('express').Router();
const passport = require('passport');

profile.get("/", authenticationMiddleware(),function(req, res){
	res.render('dashboard.ejs', {
		quote: getQuote()
	});
});

function authenticationMiddleware(){
	return (req, res, next) => {

		if(req.isAuthenticated()) return next();

		res.redirect('/login');
	}
}

function getQuote(){
	let quoteArr = ['"Beware of little expenses. A small leak will sink a great ship."', 
	'"Wealth consists not in having great possessions, but in having few wants."',
	'"All money is a matter of belief."']

	var random = Math.floor(Math.random() * Math.floor(quoteArr.length));
	
	return quoteArr[random];
}



module.exports = profile;