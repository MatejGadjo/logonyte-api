const express = require('express');
const router = express.Router();
const customLogoController = require('../controllers/customLogoController')

router.post('/', customLogoController)

module.exports = router;