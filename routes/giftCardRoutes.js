const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const { getUserGiftCards, createGiftCard,getGiftCardById,updateGiftCard,deleteGiftCard,transferAmountGiftCard} = require('../controllers/giftCardController');

router.use(authenticateUser);

router.get('/', getUserGiftCards);
router.post('/', createGiftCard);
router.get('/:id', getGiftCardById);
router.patch('/:id', updateGiftCard);
router.delete('/:id', deleteGiftCard);
router.post('/transfer', transferAmountGiftCard);
module.exports = router;
