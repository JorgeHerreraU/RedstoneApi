const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart");
const verifyToken = require("../helpers/auth");
router.get("/", cart.getCart);
router.get("/add/:id", cart.addService);
router.get("/remove/:id", cart.removeService);
router.post("/check-out", verifyToken, cart.checkOut);
module.exports = router;
