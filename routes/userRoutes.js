const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/join", ensureAuthenticated, userController.getJoinClub);
router.post("/join", ensureAuthenticated, userController.postJoinClub);

module.exports = router;