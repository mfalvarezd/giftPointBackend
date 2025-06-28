const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const { getUserGiftCards, createGiftCard,getGiftCardById} = require('../controllers/giftCardController');

router.use(authenticateUser);

router.get('/', getUserGiftCards);
router.post('/', createGiftCard);
router.get('/:id', getGiftCardById);

module.exports = router;
