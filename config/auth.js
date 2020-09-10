module.exports={
    //cant access dashboard if not logged in
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","Please Log in First");
        res.redirect("/users/login");
    },
    //cant access login,register if logged in
    userLoggedIn:function(req,res,next){
        if(req.isAuthenticated()){
            return res.redirect("/dashboard");
        }
        next();
    }
}