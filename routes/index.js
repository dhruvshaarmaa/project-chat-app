const express=require("express");
const route=express.Router();
const {ensureAuthenticated}=require("../config/auth");

//Welcome Page
route.get("/",(req,res)=>{
    res.render("welcome");
});
route.get("/dashboard",ensureAuthenticated,(req,res)=>{
    res.render("dashboard",{
        name: req.user.name
    });
});

module.exports=route;
