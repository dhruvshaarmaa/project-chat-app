const express=require("express");
const route=express.Router();
const bcrypt=require("bcryptjs");
const passport=require("passport");
const {userLoggedIn}=require("../config/auth");
//User Model
const users=require("../models/users");

//login
route.get("/login",userLoggedIn,(req,res)=>{
    res.render("login");
});
route.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect:"/dashboard",
        failureRedirect:"/users/login",
        failureFlash: true
    })(req,res,next);
});

//logout
route.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success_msg","Logged Out Successfully");
    res.redirect("/users/login");
});

//register
route.get("/register",userLoggedIn,(req,res)=>{
    res.render("register");
});
route.post("/register",(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors=[];
    //check all fields should be filled
    if(!email || !name || !password || !password2 ){
        errors.push({msg : "Please fill in all fields"});
    }
    //check passwords match
    if(password!==password2){
        errors.push({msg: "Passwords do not match"});
    }
    //check password length
    if(password.length<6){
        errors.push({msg: "Password should contain at least 6 characters"});
    }

    if(errors.length>0){
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //validation passed
        users.findOne({ email: email })
            .then((user)=>{
                if(user){
                    errors.push({msg: "Email Already Registered"});
                    res.render("register",{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }else{
                    //create new user
                    const newUser= new users({
                        name,
                        email,
                        password
                    });
                    //HashPassword
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,
                            (err,hash)=>{
                                if(err) throw err;
                                //set password to hash
                                newUser.password=hash;
                                //save new user
                                newUser.save()
                                    .then((user)=>{
                                        req.flash("success_msg","Registered Successfully");
                                        res.redirect("/users/login");
                                    })
                                    .catch((err)=>{
                                        console.error(err);
                                    })
                        });
                    })

                }
            })
    }
});

module.exports=route;