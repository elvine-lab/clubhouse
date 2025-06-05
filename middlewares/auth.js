const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please log in to view this resource");
  res.redirect("/login");
};

const ensureMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_member) {
    return next();
  }
  req.flash("error_msg", "You must be a member to view this content");
  res.redirect("/");
};

const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  req.flash("error_msg", "You must be an admin to perform this action");
  res.redirect("/");
};

module.exports = {
  ensureAuthenticated,
  ensureMember,
  ensureAdmin,
};