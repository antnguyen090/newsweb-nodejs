const modelUser = require(__path_model_backend + "manageuser");
const notify  		= require(__path_configs + 'notify');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

module.exports = function(passport){
    passport.use(new LocalStrategy(
        function(username, password, done) {
            modelUser.getItemByUsername(username, null).then( ( users) => {
                let user = users[0];
                if (user === undefined || user.length == 0) {
                    return done(null, false, { message: notify.ERROR_LOGIN });
                }else {
                    // if(md5(password) !== user.password) {
                    //     return done(null, false, { message: notify.ERROR_LOGIN });
                    // }else {
                    //     return done(null, user);
                    // }
                    bcrypt.compare(myPlaintextPassword, user.password, function(err, res) {
                    // res is true as the original password is the same
                    // res == true
                    });
                }
            });
        }
    ));
    
    passport.serializeUser(function(user, done) {
        done(null, user._id);     
    });
    
    passport.deserializeUser(function(id, done) {
        modelUser.getItem(id, null).then( (user) => {
            done(null, user);
        });
    });
}
