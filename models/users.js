//db connections and models -Table definition
const Sequelize=require("sequelize");
//to use postgres db in my heroku
let db;

if(process.env.DATABASE_URL){
    db=new Sequelize(process.env.DATABASE_URL);
}else{
    db=new Sequelize({
        dialect:"sqlite",
        storage:__dirname+"/database"
    });
}

const users=db.define("user",{
    name:{
        type:Sequelize.DataTypes.STRING(30),
        allowNull: false
    },
    email:{
        type:Sequelize.DataTypes.STRING(30),
        allowNull: false
    },
    password:{
        type:Sequelize.DataTypes.STRING(30),
        allowNull: false
    },
    date:{
        type:Sequelize.DataTypes.DATE,
        default: Date.now()
    }
});





module.exports= {users,db}