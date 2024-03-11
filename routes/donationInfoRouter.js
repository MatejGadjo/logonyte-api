const express = require('express');
const router = express.Router();
const donationInfoController = require('../controllers/donationInfoController')

router.get('/', donationInfoController)

module.exports = router;