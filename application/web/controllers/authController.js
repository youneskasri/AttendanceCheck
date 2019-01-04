exports.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'MUST_BE_SIGNED_IN');
    req.session.redirectTo = req.path;
    res.redirect('/login');
};
  
exports.isAdmin = function(req, res, next) {
  if(['ROOT', 'ADMIN'].includes(req.user.role)) {
    next();
  } else {
    req.flash('error', 'MUST_BE_ADMIN');
    res.redirect('back');
  }
};

exports.isSafe = function(req, res, next) {
  if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
    next();
  } else {
    req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
    res.redirect('back');
  }
};
