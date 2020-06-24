const { Router } = require('express');
const multer = require('../app/middlewares/multer');
const router = Router();

const RecipeController = require('../app/controllers/RecipeController');
const RecipeValidator = require('../app/validators/RecipeValidator');

const session = require('../app/middlewares/session');

router.get('/', RecipeController.index);
router.get('/create', session.onlyUsers, RecipeController.create);
router.get('/:id/edit', session.onlyUsers, RecipeValidator.edit, RecipeController.edit);
router.get('/:id', RecipeController.show);

router.use(session.onlyUsers);

router.post('/', multer.array('photos', 5), RecipeValidator.post, RecipeController.post);
router.put('/', multer.array('photos', 5), RecipeValidator.put, RecipeController.put);
router.delete('/', RecipeValidator.delete, RecipeController.delete);

module.exports = router;