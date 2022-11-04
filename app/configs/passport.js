const modelUser = require(__path_model_backend + "manageuser");
const notify  		= require(__path_configs + 'notify');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport){
    passport.use(new LocalStrategy(
        function(username, password, done) {
            try {
                modelUser.getItemByUsername({username: username}).then( async (user) => {
                    if (!user) {
                        return done(null, false, { message: notify.ERROR_LOGIN_USER});
                    }else {
                        let match = await bcrypt.compare(password,user.password);
                        if(match){
                            return done(null, user);
                        } else{
                            return done(null, false, { message: notify.ERROR_LOGIN_USER});
                        }
                    }
                });
            } catch (error) {
                console.log(error)
            }
        }
    ));
    
    passport.serializeUser(function(user, done) {
        done(null, user._id);     
    });
    
    passport.deserializeUser(function(id, done) {
        modelUser.getUserByID(id).then( (user) => {
            done(null, user);
        });
    });
}
