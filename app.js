const express=require("express");
const expressLayouts=require("express-ejs-layouts");
const mongoose=require("mongoose");
const flash=require("connect-flash");
const session=require("express-session");
const passport = require("passport");

const app=express();

//Passport config
require("./config/passport")(passport);

//DB congif 
const db=require("./config/keys").MongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology:true})
    .then(()=> console.log("Mongo DB connected"))
    .catch(err=> console.error(err))

//EJS
app.use(expressLayouts);
app.set("view engine","ejs");

//bodyparser
//we can get data from our form with req.body
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Express Session
app.use(session({
    secret:"this is a secret string",
    resave:true,
    saveUninitialized:true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    next();
});

//Routes
app.use("/",require("./routes/index"));
app.use("/users",require("./routes/users"));

let port;
if(process.env.PORT){
    port=process.env.PORT
}else{
    port=4040;
}

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`);
});