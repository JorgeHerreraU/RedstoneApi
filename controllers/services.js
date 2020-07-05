const db = require("../models");
const User = db.users;
const ServiceList = db.servicesOffered;
const Customer = db.customers;
const Service = db.services;
const ServiceCategory = db.category;
const Stage = db.stage;
const Team = db.team;

exports.listServices = (req, res) => {
    ServiceList.findAll().then((services) => {
        res.send(services);
    });
};

exports.getTeamUnavailableSchedule = (req, res) => {
    console.log(req.params.id)
    Stage.findAll({ where: { team_id: req.params.id } }).then(stage => {
        res.send(stage.map(x => x.schedule))
    })
}


exports.listUserStages = async (req, res) => {
    User.findOne({
        where: {
            id: req.userId,
        },
    }).then((user) => {
        Customer.findOne({
            where: {
                email: user.email,
            },
            include: [
                {
                    model: Service,
                    as: "services",
                    include: [
                        {
                            model: Stage,
                            as: "stages",
                            include: {
                                model: Team
                            }
                        },
                        {
                            model: ServiceList,
                            include: {
                                model: ServiceCategory,
                            },
                        },
                    ],
                },
            ],
        }).then((elements) => {
            const data = [];
            elements.services.forEach((service) => {
                const stages = [];
                service.stages.forEach((stage) => {
                    stages.push({
                        id: stage.dataValues.id,
                        name: stage.dataValues.name,
                        schedule: stage.dataValues.schedule,
                        ammount: stage.dataValues.ammount,
                        team: {
                            id: stage.team.id,
                            name: stage.team.name
                        }
                    });
                });
                data.push({
                    id: service.dataValues.id,
                    name: service.dataValues.serviceoffered.name,
                    description: service.dataValues.serviceoffered.description,
                    stages: stages,
                });
            });
            res.send(data);
        });
    });
};

exports.removeService = (req, res) => {
    User.findOne({
        where: {
            id: req.userId,
        },
    }).then(user => {
        Customer.findOne({
            where: {
                email: user.email
            }
        }).then(customer => {
            if (customer !== null) {
                Stage.findAll({
                    where: {
                        service_id: req.params.id
                    }
                }).then(stages => {
                    const paidServicesArray = stages.map(x => x.isPaid === true)
                    if (paidServicesArray.length === 0) {
                        Service.destroy({
                            where: {
                                id: req.params.id,
                                customer_id: customer.id
                            }
                        })
                        res.send({ message: 'Servicio eliminado con éxito' });
                    } else {
                        res.status(500).send({ message: 'Imposible de borrar, servicio tiene etapadas pagadas' })
                    }
                })
            }
        })
    })

};
