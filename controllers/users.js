const User=require("../models/user.js");

module.exports.rendersignUpform=(req, res) => {
  res.render("users/signup.ejs");
}
module.exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome ${registeredUser.username}`);
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin=(req, res) => {
  res.render("users/login.ejs");
}

module.exports.Login=(req, res) => {
    req.flash("success", `Welcome ${req.user.username}`);
    res.redirect(res.locals.redirectUrl || "/listings");
  }

  module.exports.logOut=(req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
}

