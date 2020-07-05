const db = require("../models");
const User = db.users;
const Customer = db.customers;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require("nodemailer");

// register
exports.register = (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })
        .then((user) => {
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400,
            });
            res.status(200).send({ auth: true, token: token });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al intentar crear el usuario",
            });
        });
};

// get profile
exports.profile = (req, res, next) => {
    User.findOne({
        where: { id: req.userId },
        attributes: ["id", "username", "email"],
    })
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al solicitar usuario",
            });
        });
};

// login
exports.login = (req, res) => {
    User.findOne({
        where: { email: req.body.email },
    })
        .then((user) => {
            const validPassword = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!validPassword)
                return res.status(401).send({ auth: false, token: null });
            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400,
            });
            res.status(200).send({ auth: true, token: token });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al iniciar sesión",
            });
        });
};

// forgot password
exports.forgotPassword = (req, res) => {
    if (req.body.email === "")
        return res.status(400).send("Se necesita ingresar un e-mail");
    User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user === null) return res.status(403).send("Email inválido");
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400,
        });
        user.update({
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 86400,
        });
        const transporter = nodemailer.createTransport({
            host: "in-v3.mailjet.com",
            auth: {
                user: "9a7493fde7e2520ed36eeff77d51c874",
                pass: "0418d9dc7598445d3e0bd7c2d7cf7175",
            },
        });
        const mailOptions = {
            from: "jorgeherreraulloa@vtr.net",
            to: user.email,
            subject: "Link para Reiniciar Contraseña",
            text: `token: ${token}`,
        };
        transporter.sendMail(mailOptions, (err, response) => {
            if (err)
                return res.status(500).send({ message: "Error al enviar e-mail" });
            res.status(200).json("Email de recuperación enviado");
        });
    });
};

// reset password
exports.resetPassword = (req, res) => {
    User.findOne({
        where: {
            resetPasswordToken: req.query.token,
            resetPasswordExpires: {
                [Op.gt]: Date.now(),
            },
        },
    }).then((user) => {
        if (user === null)
            return res.json("el link de reinicio de contraseña es inválido o expiró");
        res.status(200).send({
            username: user.username,
            token: user.resetPasswordToken,
            tokenExpiration: user.resetPasswordExpires,
            message: "link para reiniciar contraseña aceptado",
        });
    });
};

// update password
exports.updatePassword = (req, res) => {
    User.findOne({
        where: {
            resetPasswordToken: req.body.token,
            resetPasswordExpires: {
                [Op.gt]: Date.now(),
            },
        },
    })
        .then((user) => {
            if (user != null) {
                const hashedPassword = bcrypt.hashSync(req.body.password, 8);
                user.update({
                    password: hashedPassword,
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                });
                res.status(200).json("Contraseña actualizada con éxito");
            } else {
                res.status(404).json("No existe el usuario en la base");
            }
        })
        .catch(err =>
            res.status(500).send({ message: `Ha ocurrido un error ${err}` })
        );
};

// update details
exports.updateProfile = (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res
            .status(422)
            .send({ message: "No se han recibido todos los campos" });
    }
    User.findOne({
        where: { id: req.userId },
        attributes: ["id", "username", "email"],
    })
        .then((user) => {
            if (user) {
                user.update({
                    username: req.body.username,
                    email: req.body.email,
                });
                Customer.findOne({
                    where: { email: req.body.email },
                }).then((customer) => {
                    if (customer) {
                        customer.update({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            phone: req.body.phone,
                        });
                    } else {
                        Customer.create({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            phone: req.body.phone,
                        });
                    }
                    res.status(200).send({ message: "Perfil actualizado con éxito" });
                });
            } else {
                res.status(404).json("No existe el usuario en la base");
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al solicitar usuario",
            });
        });
};
