const StringHelpers 	= require(__path_helpers + 'string');
const systemConfig       = require(__path_configs + 'system');

const linkLogin		     = StringHelpers.formatLink('/auth/login'); 

module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        if(req.user.username == "thinhnguyenxy04@gmail.com") {
            let userInfo = {};
            userInfo = req.user;
            res.locals.userInfo = userInfo;
            next();
        }else {
            res.redirect('/index');
        }
    }else {
        res.redirect(linkLogin);
    }   
}