const { deepEqual } = require("assert");
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
//las tarjetas le pertener a un usuario, por lo que no se puede crear una gift card sin un usuario asociado
//El usuario debe estar autenticado para crear una gift card
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
      ownerId: req.user.id,
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

    const giftCard = data.giftcards.find(
      (card) => card.id.toString() === giftCardId
    );

    if (!giftCard) {
      return res.status(404).json({ message: "Gift card no encontrada" });
    }

    if (giftCard.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para ver esta gift card" });
    }

    res.status(200).json(giftCard);
  } catch (error) {
    console.error("Error al obtener gift card:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
const updateGiftCard = (req, res) => {
  const giftCardId = req.params.id;
  const { amount, expirationDate } = req.body;

  try {
    const rawData = fs.readFileSync(dbPath);
    const data = JSON.parse(rawData);

    const giftCard = data.giftcards.find(
      (card) => card.id.toString() === giftCardId
    );

    if (!giftCard) {
      return res.status(404).json({ message: "Gift card no encontrada" });
    }

    if (giftCard.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar esta gift card" });
    }

    // Validaciones
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: "El monto debe ser mayor a 0" });
      }
      giftCard.amount = amount;
    }

    if (expirationDate) {
      const today = new Date();
      const newExpiration = new Date(expirationDate);
      if (newExpiration <= today) {
        return res
          .status(400)
          .json({ message: "La fecha de expiración debe ser futura" });
      }
      giftCard.expirationDate = expirationDate;
    }

    // Guardar cambios
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.status(200).json(giftCard);
  } catch (error) {
    console.error("Error al actualizar gift card:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const deleteGiftCard = (req, res) => {
  const giftCardId = req.params.id;

  try {
    const rawData = fs.readFileSync(dbPath);
    const data = JSON.parse(rawData);

    const giftCardIndex = data.giftcards.findIndex(
      (card) => card.id.toString() === giftCardId
    );

    if (giftCardIndex === -1) {
      return res.status(404).json({ message: "Gift card no encontrada" });
    }

    if (data.giftcards[giftCardIndex].ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta gift card" });
    }

    data.giftcards.splice(giftCardIndex, 1);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: "Gift card eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar gift card:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
//Transferir una parte del saldo de una gift card a otra.
//Ambas gift cards pertenezcan al mismo usuario.
//Devolver los detalles actualizados de ambas gift cards.
const transferAmountGiftCard = (req, res) => {
  const { sourceCardId, destinationCardId, amount } = req.body;

  if (!sourceCardId || !destinationCardId || !amount) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "El monto debe ser mayor a 0" });
  }

  try {
    const rawData = fs.readFileSync(dbPath);
    const data = JSON.parse(rawData);

    const sourceCard = data.giftcards.find(
      (card) => card.id.toString() === sourceCardId
    );
    const destinationCard = data.giftcards.find(
      (card) => card.id.toString() === destinationCardId
    );

    // Verifica que existan ambas
    if (!sourceCard || !destinationCard) {
      return res
        .status(404)
        .json({ message: "Una o ambas gift cards no existen" });
    }

    // Verifica propiedad
    if (
      sourceCard.ownerId !== req.user.id ||
      destinationCard.ownerId !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para usar una de las gift cards" });
    }

    // Verificar saldo
    if (sourceCard.amount < amount) {
      return res
        .status(400)
        .json({ message: "Saldo insuficiente en la tarjeta fuente" });
    }

    // Actualizar saldos
    sourceCard.amount -= amount;
    destinationCard.amount += amount;

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.status(200).json({
      message: "Transferencia realizada con éxito",
      sourceCard,
      destinationCard,
    });
  } catch (error) {
    console.error("Error en transferencia:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  getUserGiftCards,
  createGiftCard,
  getGiftCardById,
  updateGiftCard,
  deleteGiftCard,
  transferAmountGiftCard,
};
