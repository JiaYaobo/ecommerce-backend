const router = require('express').Router();
const bcrypt = require('bcrypt');
const sqldb = require('../sqldb');
const jwt = require("jsonwebtoken");
//REGISTER 
router.post('/register', async (req,res)=>{
    try{
        //generate password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        hashedPasswordString = hashedPassword.toString();
        //create a new user
        pool = await sqldb;
        await pool.query`insert into user (username, email, password, home_address, mobile) values(${req.body.username}, ${req.body.email}, ${hashedPasswordString}, ${req.body.home_address}, ${req.body.mobile})`;
        result  = await pool.query`select * from user where email=${req.body.email}`;
        user= await result.recordsets[0][0];
        res.status(200).json(user);
        }catch(err){
        res.status(500).json(err);
        }
    }
);

//LOGIN
router.post('/login', async (req,res)=>{
    try{
        pool = await sqldb;
        result = await pool.query`select * from [user] where email = ${req.body.email}`;
        user = result.recordsets[0][0]
        !user && res.status(404).send("user not found");
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("wrong password")
        
        const accessToken = jwt.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
          );

        const { password, ...others } = user;
        res.status(200).json({...others, accessToken});
        }catch(err){
            console.log(err);
        }
    }
);


module.exports = router;