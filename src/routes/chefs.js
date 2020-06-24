const { Router } = require('express');
const multer = require('../app/middlewares/multer');

const router = Router();

const ChefController = require('../app/controllers/ChefController');
const ChefValidator = require('../app/validators/ChefValidator');

const session = require('../app/middlewares/session');

router.get('/create', session.isAdmin, ChefController.create);
router.get('/:id/edit', session.isAdmin, ChefController.edit);
router.get('/:id', ChefController.show);
router.get('/', ChefController.index);

router.use(session.isAdmin);

router.post('/', multer.array('photos', 6), ChefValidator.post,ChefController.post);
router.put('/', multer.array('photos', 6), ChefController.put);
router.delete('/', ChefController.delete);

module.exports = router;