const db = require("../models");
const Cart = require("../models/Cart");
const Op = db.Sequelize.Op;
const User = db.users;
const Customer = db.customers;
const ServiceList = db.servicesOffered;
const Address = db.address;
const Service = db.services;
const { v4: uuidv4 } = require("uuid");

exports.getCart = (req, res) => {
    if (!req.session.cart)
        return res.send({
            message: "No se han agregado servicios al carro",
        });
    const cart = new Cart(req.session.cart);
    res.send(cart);
};
exports.addService = (req, res) => {
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    ServiceList.findAll({ raw: true }).then((services) => {
        const service = services.filter(
            (item) => item.id === Number(req.params.id)
        );
        if (service.length > 0) {
            cart.add(service[0], Number(req.params.id));
            req.session.cart = cart;
            res.send(cart);
        } else {
            res.send({
                message: "Servicio no existe",
            });
        }
    });
};
exports.removeService = (req, res) => {
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.remove(req.params.id);
    req.session.cart = cart;
    res.send({
        message: "Servicio eliminado con éxito",
    });
};
exports.checkOut = (req, res) => {
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    const uuid = uuidv4();
    cart.id = uuid;
    ServiceList.findAll({
        raw: true,
    }).then((services) => {
        // check if session cart price equals to inventory class price
        for (let i = 0; i < cart.services.length; i++) {
            for (let j = 0; j < services.length; j++) {
                if (cart.services[i].id === services[j].id) {
                    if (cart.services[i].basePrice !== services[j].basePrice) {
                        return res.status(422).send("Error del carro de compras");
                    }
                }
            }
        }
    });
    User.findOne({
        where: {
            id: req.userId,
        },
        attributes: ["id", "username", "email"],
        raw: true,
    })
        .then((user) => {
            Customer.findOne({
                where: {
                    email: user.email,
                },
            }).then((customer) => {
                Address.upsert({
                    number: req.body.number,
                    street: req.body.street,
                    apartment: req.body.apartment,
                    district: req.body.district,
                    city: req.body.city,
                    customer_id: customer.id,
                });
                cart.services.forEach((service) => {
                    Service.create({
                        customer_id: customer.id,
                        serviceoffered_id: service.id,
                        cart_id: uuid,
                    });
                });
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error al solicitar usuario",
            });
        });
    res.send(cart);
};
