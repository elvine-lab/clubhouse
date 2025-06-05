const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { ensureAuthenticated, ensureAdmin } = require("../middlewares/auth");

router.get("/", messageController.getAllMessages);
router.get("/messages/new", ensureAuthenticated, messageController.getCreateMessage);
router.post("/messages", ensureAuthenticated, messageController.postCreateMessage);
router.post("/messages/:id/delete", ensureAuthenticated, ensureAdmin, messageController.deleteMessage);

module.exports = router;