const { Router } = require('express');
const router = Router();

const HomeController = require('../app/controllers/HomeController');

router.get('/recipes', HomeController.searchRecipe);
router.get('/chefs', HomeController.listChef);
router.get('/recipes/:id', HomeController.showRecipe);
router.get('/chefs/:id', HomeController.showChef);
router.get('/about', HomeController.about);
router.get('/', HomeController.index);

module.exports = router;