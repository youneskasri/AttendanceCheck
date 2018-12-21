const express = require('express'),
	router = express.Router(),
    catchErrors = require("express-catch-async"),
	passport = require("passport");

const scannerController = require("../controllers/scannerController");
const dataController = require("../controllers/dataController");
const configurationController = require("../controllers/configurationController");
const { isLoggedIn } = require("../controllers/authController");

/* Login & Logout */
router.get('/login', showLoginPage)
	.post('/login', handleLogin)
	.use('/logout', handleLogout);

router.use(isLoggedIn)
	.use(configurationController.setVolumeOnByDefault)
	.post('/volume', configurationController.setVolume)
	.get('/', catchErrors(scannerController.indexQrScanner))
	.get('/export/:format', catchErrors(dataController.exportDataToFormat));

router /* Protected Routes, Need Login */
	.get('/logs', isLoggedIn, configurationController.showLogs)
	.get('/memory', isLoggedIn, configurationController.getMemoryUsage)
	.get('/memory/graph', isLoggedIn, configurationController.showMemoryUsageGraph);
	

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


