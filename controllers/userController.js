const User = require("../models/User");

exports.getJoinClub = (req, res) => {
  if (req.user.is_member) {
    req.flash("error_msg", "You are already a member");
    return res.redirect("/");
  }
  res.render("user/join", { title: "Join Club" });
};

exports.postJoinClub = async (req, res) => {
  const { passcode } = req.body;

  if (passcode !== process.env.MEMBER_PASSCODE) {
    req.flash("error_msg", "Incorrect passcode");
    return res.redirect("/join");
  }

  try {
    await User.updateMembership(req.user.id, true);
    req.flash("success_msg", "Welcome to the club! You can now see who wrote each message.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to join the club");
    res.redirect("/join");
  }
};