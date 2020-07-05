const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
// libs setup
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
// app.use(cors())
// sequelize
const db = require("./models");
db.sequelize.sync();
app.get("/", (req, res) => res.send("OK"));
const user = require("./routes/user");
app.use("/users", user);
const services = require("./routes/services");
app.use("/services", services);
const cart = require("./routes/cart");
app.use("/cart", cart);
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));