const { Router } = require('express');
const routes = Router();

const home = require('./home');
const admin = require('./admin');
const session = require('./session');


routes.use('/home', home);
routes.use('/admin', admin);
routes.use('/session', session);

routes.get('/chefs', (req, res) => res.redirect('/home/chefs'));
routes.get('/recipes', (req, res) => res.redirect('/home/recipes'));
routes.get('/about', (req, res) => res.redirect('/home/about'));
routes.get('/', (req, res) => res.redirect('/home'));

module.exports = routes;