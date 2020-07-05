const express = require('express');
const router = express.Router();
const services = require('../controllers/services')
const verifyToken = require('../helpers/auth')

router.get('/', services.listServices)
router.get('/stages', verifyToken, services.listUserStages)
router.get('/team/blackouts/:id', verifyToken, services.getTeamUnavailableSchedule)
router.get('/remove/:id', verifyToken, services.removeService)
module.exports = router;
