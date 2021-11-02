const router = require('express').Router();
const bcrypt = require('bcrypt');
const sqldb = require('../sqldb');

//REGISTER
router.post('/register', async (req,res)=>{
    try{
        //generate password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        hashedPasswordString = hashedPassword.toString();
        //create a new user
        pool = await sqldb;
        await pool.query`insert into member(username, email, password, home_address, mobile) values(${req.body.username}, ${req.body.email}, ${hashedPasswordString}, ${req.body.home_address}, ${req.body.mobile})`;
        result  = await pool.query`select * from member where email=${req.body.email}`;
        member = await result.recordsets[0][0];
        res.status(200).json(member);
        }catch(err){
        res.status(500).json(err);
        }
    }
);


//LOGIN
router.post('/login', async (req,res)=>{
    try{
        pool = await sqldb;
        result = await pool.query`select * from member where email = ${req.body.email}`;
        member = result.recordsets[0][0]
        !member && res.status(404).send("member not found");
        const validPassword = await bcrypt.compare(req.body.password,member.password);
        !validPassword && res.status(400).json("wrong password");
        res.status(200).json(member);
        }catch(err){
            console.log(err);
        }
    }
);


module.exports = router;