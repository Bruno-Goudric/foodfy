const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./db');

module.exports = session(
{
    store: new pgSession({ pool: db }),
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
});