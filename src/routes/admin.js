
const { Router } = require('express');
const router = Router();

const recipes = require('./recipes');
const chefs = require('./chefs');
const users = require('./users');
const profile = require('./profile');

const session = require('../app/middlewares/session');


router.use('/recipes', recipes);
router.use('/chefs', chefs);
router.use(session.onlyUsers);
router.use('/users', users);
router.use('/profile', profile);


module.exports = router;