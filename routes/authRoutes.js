const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/logout", ensureAuthenticated, authController.logout);

module.exports = router;