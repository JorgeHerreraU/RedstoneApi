const jwt = require('jsonwebtoken');
const config = require('../config/config');

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No existe el token.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Error al autenticar token.' });
        // si todo esta bien, guardar en el request userId para usarlo en otras rutas
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;