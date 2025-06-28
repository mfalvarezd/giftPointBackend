const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbPath = path.join(__dirname, '../db/database.json');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { email, password } = req.body;

    // Validar datos de entrada
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son Requeridos' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Leer base de datos
    const rawData = fs.readFileSync(dbPath);
    const data = JSON.parse(rawData);

    // Verificar si el email ya está registrado
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Cifrar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
        id: data.users.length + 1,
      email,
      password: hashedPassword
    };
    
    // Guardar en base de datos
    data.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son Requeridos' });
    }

    try {
      // Leer base de datos
      const rawData = fs.readFileSync(dbPath);
      const data = JSON.parse(rawData);

      // Verificar si el usuario existe
      const user = data.users.find(user => user.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token =    jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Cambia el tiempo de expiración según tus necesidades
      );

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: token
        });

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
  registerUser,
  loginUser
};
