const { Router } = require('express');
const router = Router();

const ProfileController = require('../app/controllers/ProfileController');
const ProfileValidator = require('../app/validators/ProfileValidator');

router.get('/', ProfileValidator.index, ProfileController.index);
router.put('/', ProfileValidator.put, ProfileController.put);

module.exports = router;