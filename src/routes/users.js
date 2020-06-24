const { Router } = require('express');
const router = Router();

const UserController = require('../app/controllers/UserController');
const UserValidator = require('../app/validators/UserValidator');

const session = require('../app/middlewares/session');

router.use(session.isAdmin);
router.get('/', UserController.index);
router.get('/create', UserController.create);
router.get('/:id/edit', UserValidator.edit, UserController.edit);


router.post('/', UserValidator.post, UserController.post);
router.put('/', UserValidator.put, UserController.put);
router.delete('/', UserValidator.delete, UserController.delete);

module.exports = router;