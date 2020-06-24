const { Router } = require('express');
const router = Router();

const SessionController = require('../app/controllers/SessionController');
const SessionValidator = require('../app/validators/SessionValidator');

router.get('/', (req, res) => res.redirect('/session/login'));
router.get('/new-password', SessionController.newPassword);
router.get('/login', SessionController.loginIndex);
router.get('/logout', SessionController.logout);
router.get('/forgot', SessionController.forgotIndex);
router.post('/password-reset', SessionValidator.reset, SessionController.resetPassword);
router.post('/login', SessionValidator.login,SessionController.login);
router.post('/forgot', SessionValidator.forgot, SessionController.forgot);

module.exports = router;