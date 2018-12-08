const express = require('express'),
	router = express.Router(), 
	passport = require("passport");

const scannerService = require("../services/scannerService");
const dataService = require("../services/dataService");
const authService = require("../services/authService");
const configurationService = require("../services/configurationService");
const { isLoggedIn } = authService;

/* Login & Logout */
router.get('/login', showLoginPage)
	.post('/login', handleLogin)
	.use('/logout', handleLogout);

router.use(isLoggedIn)
	.use(configurationService.setVolumeOnByDefault)
	.post('/volume', configurationService.setVolume)
	.get('/', scannerService.indexQrScanner)
	.get('/export/:format', dataService.exportDataToFormat);

router /* Protected Routes, Need Login */
	.get('/logs', isLoggedIn, configurationService.showLogs)
	.get('/memory', isLoggedIn, configurationService.getMemoryUsage)
	.get('/memory/graph', isLoggedIn, configurationService.showMemoryUsageGraph);
	

function showLoginPage(req, res, next) { return res.render("login"); }

function handleLogin(req, res, next) {
	let successRedirect = req.session.redirectTo || '/';
	delete req.session.redirectTo;
	return passport.authenticate("local", {
        successRedirect,
        failureRedirect: "/login",
        failureFlash: "PASSWORD_OR_USERNAME_INCORRECT",
        successFlash: "AUTH_SUCCESS_MESSAGE"
	})(req, res, next);
}

function handleLogout(req, res, next){
   req.logout();
   req.flash("success", "LOGOUT_SUCCESS_MESSAGE");
   res.redirect("/login");
}


module.exports = router;


