const express = require('express');
const router = express.Router();
const users = require('../controllers/user')
const verifyToken = require('../helpers/auth')

router.post('/register', users.register)
router.get('/profile', verifyToken, users.profile)
router.get('/login', users.login)
router.get('/forgot-password', users.forgotPassword)
router.get('/reset-password', users.resetPassword)
router.post('/update-password', users.updatePassword)
router.post('/update-profile', verifyToken, users.updateProfile)
module.exports = router;