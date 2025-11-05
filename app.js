if(process.env.NODE_ENV!=="production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
const session=require("express-session"); 
 const MongoStore=require("connect-mongo");
const flash =require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local"); 
const User =require("./models/user.js");  

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dburl=process.env.ATLASDB_URL || MONGO_URL;

main().then(() => {
  console.log("connected to DB")
}).catch(err => {
  console.log(err);
})
async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*60*60
}) 

store.on("error",function(e){
  console.log("Error in mongo session store",e   );
})

const sessionOption={
  store, 
  secret:process.env.SECRET, 
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*60*60*24*1000,
    maxAge:7*60*60*24*1000,
    httpOnly:true
  }
};

app.get("/", (req, res) => {
  res.redirect("/listings")
})



app.use(session(sessionOption));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //Serialize user into session
passport.deserializeUser(User.deserializeUser());  ////des erialize user into session


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// app.get("/demouser", async(req,res)=>{
//   let fakeUSer= new User({
//     email:"2bMkF@example.com",
//     username:"demoUser"
//   });
//   let registeredUser=  await User.register(fakeUSer,"helloworld")
//   res.send(registeredUser)
// })

app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter )

 
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"))
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
})

app.listen(8080, () => {
  console.log("Server is listeining to port 8080");
})