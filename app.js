require('dotenv').config();
const express = require('express');
const app = express();
 const authRoutes = require('./routes/authRoutes');
 const giftCardRoutes = require('./routes/giftCardRoutes');
 const logger = require('./middleware/logger');

 app.use(express.json());

 app.use(logger);

 app.use('/auth', authRoutes);
 app.use('/giftcards', giftCardRoutes);
 const PORT = process.env.PORT || 3000;

 app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
 });