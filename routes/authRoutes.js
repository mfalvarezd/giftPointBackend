const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

router.get('/test', (req, res) => {
  res.send('Auth route funcionando');
});

router.post('/register', registerUser);

module.exports = router;
