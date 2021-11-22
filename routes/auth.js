const router = require("express").Router();
const bcrypt = require("bcrypt");
const sqldb = require("../sqldb");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    hashedPasswordString = hashedPassword.toString();
    //create a new user
    pool = await sqldb;
    await pool.query`insert into users (username, email, password, home_address, mobile) values(${req.body.username}, ${req.body.email}, ${hashedPasswordString}, ${req.body.home_address}, ${req.body.mobile})`;
    result = await pool.query`select * from user where email=${req.body.email}`;
    user = await result.recordsets[0][0];
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    pool = await sqldb;
    result =
      await pool.query`select * from users where user_email = ${req.body.user_email}`;
    user = await result.recordsets[0][0];
    console.log(user);
    !user && res.status(404).send("user not found");
    // const validPassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    const validPassword = (await req.body.user_password) === user.user_password;
    !validPassword && res.status(400).json("wrong password");

    const accessToken = jwt.sign(
      {
        id: user.user_id,
        isAdmin: user.user_status === "1" || user.user_status === "2",
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { user_password, ...others } = user;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
