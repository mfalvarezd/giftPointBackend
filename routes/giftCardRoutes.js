const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const { getUserGiftCards, createGiftCard } = require('../controllers/giftCardController');

router.use(authenticateUser);

router.get('/', getUserGiftCards);
router.post('/', createGiftCard);

module.exports = router;
