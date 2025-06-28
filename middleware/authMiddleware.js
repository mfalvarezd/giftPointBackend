const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
//verificamos que este la cabecera de autorización y que comience con 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o mal formado' });
  }
// Extraemos el token de la cabecera
  const token = authHeader.split(' ')[1]; 

  try {
//decodificamos el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
//extraemos el id y email del usuario del token decodificado
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authenticateUser;
