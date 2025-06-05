const Message = require("../models/Message");

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.render("messages/list", {
      title: "Clubhouse Messages",
      messages,
    });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to load messages");
    res.redirect("/");
  }
};

exports.getCreateMessage = (req, res) => {
  res.render("messages/create", { title: "Create New Message" });
};

exports.postCreateMessage = async (req, res) => {
  const { title, content } = req.body;

  try {
    await Message.create({
      title,
      content,
      userId: req.user.id,
    });
    req.flash("success_msg", "Message created successfully");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to create message");
    res.redirect("/messages/new");
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.delete(req.params.id);
    req.flash("success_msg", "Message deleted successfully");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to delete message");
    res.redirect("/");
  }
};