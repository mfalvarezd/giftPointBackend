# GiftPoint Backend

API RESTful construida con Node.js y Express para gestionar usuarios, autenticación con JWT y administración de gift cards.

##  Tecnologías utilizadas

- Node.js
- Express.js
- JWT (autenticación)
- bcryptjs (encriptación de contraseñas)
- fs / JSON (como base de datos local)
- dotenv (variables de entorno)
- Jest + Supertest (pruebas unitarias)



## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/giftPointBackend.git
   cd giftPointBackend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` con tu clave secreta:

   ```env
   JWT_SECRET=secret
   ```

4. Ejecuta el servidor en desarrollo:

   ```bash
   npm run dev
   ```

## Endpoints 

### Autenticación

| Método | Ruta             | Descripción            |
|--------|------------------|------------------------|
| POST   | `/auth/register` | Registro de usuario    |
| POST   | `/auth/login`    | Login,  devuelve token |

### Gift Cards (requiere token JWT)

Agregar esto al encabezado de las solicitudes `/giftcards`:

```
Authorization: Bearer TU_TOKEN
```

| Método | Ruta                    | Descripción                            |
|--------|-------------------------|----------------------------------------|
| GET    | `/giftcards`            | Lista las gift cards del usuario       |
| POST   | `/giftcards`            | Crea una nueva gift card               |
| GET    | `/giftcards/:id`        | Obtiene una gift card específica       |
| PATCH  | `/giftcards/:id`        | Actualiza monto o fecha de expiración |
| DELETE | `/giftcards/:id`        | Elimina una gift card                  |
| POST   | `/giftcards/transfer`   | Transfiere saldo entre gift cards      |

## Pruebas

Ejecutar las pruebas con:

```bash
npm test
```

Incluye pruebas unitarias con Jest para:

- Registro de usuario
- Inicio de sesión
- Consulta de gift cards

##  Nota

- Esta API usa un archivo `.json` como base de datos, por lo que debe crearse el archivo `/db/database.json` en la ruta `/db/`


