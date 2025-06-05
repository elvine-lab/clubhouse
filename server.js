require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const flash = require("connect-flash");
const expressHbs = require("express-handlebars");
const { pool } = require("./config/db");

const app = express();

// Database connection check
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
  console.log("Connected to database successfully");
});

// Passport config
require("./config/passport-config")(passport);

// View engine setup
app.engine(
  "ejs",
  expressHbs.engine({
    extname: "ejs",
    defaultLayout: "main",
    helpers: {
      formatDate: function (date) {
        return new Date(date).toLocaleString();
      },
    },
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Elvine",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/messageRoutes"));
app.use("/", require("./routes/userRoutes"));

// Error handling
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error" });
});

const PORT = process.env.PORT || 5020;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});