if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ===============================
// DATABASE
// ===============================
const dburl = process.env.MONGODB_URI;

mongoose.connect(dburl)
  .then(() => console.log("connected to DB"))
  .catch(err => console.error(err));

// ===============================
// APP CONFIG
// ===============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// SESSION STORE (FIXED)
// ===============================
// Use MongoDB-backed sessions in production. In development, the default
// in-memory store keeps the server usable while a local database is offline.
const store = process.env.NODE_ENV === "production"
  ? MongoStore.create({
      mongoUrl: dburl,
      crypto: { secret: process.env.SECRET },
      touchAfter: 24 * 60 * 60
    })
  : undefined;

store?.on("error", (e) => {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  ...(store ? { store } : {}),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

app.use(session(sessionOptions));
app.use(flash());

// ===============================
// PASSPORT
// ===============================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===============================
// LOCALS
// ===============================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ===============================
// ROUTES
// ===============================
app.get("/", (req, res) => {
  res.render("welcome.ejs");
});

app.get("/home", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ===============================
// ERROR HANDLING
// ===============================
// ===============================
// ERROR HANDLING (EXPRESS 5 SAFE)
// ===============================

// 404 handler
app.use((req, res, next) => {
  if (!res.headersSent) {
    return next(new ExpressError(404, "Page Not Found!"));
  }
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const { statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { err });
});


// ===============================
// SERVER
// ===============================
app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
