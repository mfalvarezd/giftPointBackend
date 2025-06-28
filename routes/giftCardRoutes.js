const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.send('Giftcard route funcionando');
});

module.exports = router;
