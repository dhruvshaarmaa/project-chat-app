const mongoose=require("mongoose");
const LocalStrategy=require("passport-local").Strategy;
const bcrypt=require("bcryptjs");

//Load Users model
const {users}=require("../models/users");

module.exports=function(passport){
    passport.use(
        new LocalStrategy({ usernameField: "email" },
            (email,password,done)=>{
                //Match
                users.findOne({ email : email })
                    .then((user)=>{
                        //No Match
                        if(!user){
                            return done(null,false,{message: "No such User Exists"})
                        }
                        //Match Password
                        bcrypt.compare(password,user.password,(err,isMatch)=>{
                            if(err) throw err;
                            if(isMatch){
                                return done(null,user);
                            }else{
                                return done(null,false,{ message: "Incorrect Password"});
                            }
                        });
                    })
                    .catch((err)=>console.log(err))
            })
    );
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser((id,done)=>{
        users.findById(id,(err,user)=>{
            done(err,user);
        });
    });

}