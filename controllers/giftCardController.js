const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../db/database.json");

const getUserGiftCards = (req, res) => {
  try {
    const rawData = fs.readFileSync(dbPath);
    const data = JSON.parse(rawData);

    const userId = req.user.id;

    // Obtenemos las gift cards del usuario
    const userGiftCards = data.giftcards.filter(
      (card) => card.ownerId === userId
    );

    res.status(200).json(userGiftCards);
  } catch (error) {
    console.error("Error al obtener las gift cards:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
const createGiftCard = (req, res) => {
  const { amount, currency, expirationDate } = req.body;

  if (!currency || !amount || !expirationDate) {
    return res
      .status(400)
      .json({ message: "Código, monto y fecha de expiración son requeridos" });
  }
  if (amount <= 0) {
    return res.status(400).json({ message: "El monto debe ser mayor a 0" });
  }
  if (!currency || typeof currency !== "string") {
    return res.status(400).json({ message: "Dato inválido" });
  }
  const today = new Date();
  const expiration = new Date(expirationDate);
  if (!expirationDate || expiration <= today) {
    return res
      .status(400)
      .json({ message: "La fecha de expiración debe ser futura" });
  }

  try {
    const rawData = fs.readFileSync(dbPath);
    const data = JSON.parse(rawData);

     const newGiftCard = {
      id: data.giftcards.length + 1, 
      amount,
      currency,
      expirationDate,
      ownerId: req.user.id
    };
    data.giftcards.push(newGiftCard);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.status(201).json(newGiftCard);
  } catch (error) {
    console.error("Error al crear la gift card:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const getGiftCardById = (req, res) => {
  const giftCardId = req.params.id;

  try {
    const rawData = fs.readFileSync(dbPath);
    const data = JSON.parse(rawData);

    const giftCard = data.giftcards.find(card => card.id.toString() === giftCardId);


    if (!giftCard) {
      return res.status(404).json({ message: 'Gift card no encontrada' });
    }

    if (giftCard.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta gift card' });
    }

    res.status(200).json(giftCard);
  } catch (error) {
    console.error('Error al obtener gift card:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getUserGiftCards,
  createGiftCard,
    getGiftCardById
};
