var app = require('express')();
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var session = require('express-session');
var config = require('./config.js');
var port = 3000;

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
  domain: config.authDomain,
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: 'http://localhost:3000/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/'}), function(req, res) {
    res.status(200).send(req.user);
})

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  res.status(200).send(req.user);
})



app.listen(port, function(){
    console.log('Listening on port ' + port);
})