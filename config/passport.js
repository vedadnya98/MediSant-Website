require('https').globalAgent.options.rejectUnauthorized = false;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var User = require('../models/Users');
let Doctor = require('../models/Doctors');

module.exports = function(passport){

    // Serialize the user for the sesison
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Used to unserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    var callback = "/oauth/signin/callback";
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: callback,
        passReqToCallback: true
    },
        function(req, accessToken, refreshToken, profile, done) {
            if(req.session.doctor){
                Doctor.findOne({'email': profile.emails[0].value},function (error, doctor) {
                    if (error){
                        return done(error);
                    }
                    else if (doctor) {
                        req.session.user = doctor;
                        req.session.imageUrl = profile['_json']['picture'];
                        req.session.loggedIn = true;
                        req.session.newUser = false;
                        req.session.role = doctor.role;
                        req.flash('toastStatus', 'success');
                        req.flash('toastMessage', 'Hey '+profile.name.givenName+', welcome back!');
                        return done(null, doctor);
                    }
                    else {
                        // console.log(profile);
                        req.flash('toastStatus', 'error');
                        req.flash('toastMessage', 'There is no such Doctor');
                        return done(null, null);
                    }
                });
            }
            else{
                User.findOne({ 'email': profile.emails[0].value }, function (error, user) {
                    if(error){
                        return done(error);
                    }else if(user){
                        console.log(profile);
                        req.session.user = user;
                        req.session.imageUrl = profile['_json']['picture'];
                        req.session.loggedIn = true;
                        req.session.newUser = false;
                        req.session.role = user.role;
                        req.flash('toastStatus', 'success');
                        req.flash('toastMessage', 'Hey '+profile.name.givenName+', welcome back!');
                        return done(null, user);
                    }
                    else{
                        req.session.newUser = true;
                        req.session.loggedIn = true;
                        req.session.user = profile;
                        req.session.user.name = profile.displayName;
                        req.session.user.email = profile.emails[0].value;
                        req.session.user.imageUrl = profile.photos[0].value;
                        req.session.imageUrl = profile['_json']['picture'];

                        return done(null,null);
                        // console.log(profile);
                        // req.flash('toastStatus', 'error');
                        // req.flash('toastMessage', 'There is no such user');
                        // return done(null, null);
                    }
                });
            }
        }
    ));

};
