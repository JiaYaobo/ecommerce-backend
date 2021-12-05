const router = require("express").Router();
const sqldb = require("../sqldb");

//update a user's info
router.post("/update/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
        update
        users
        set 
        user_city = ${req.body.user_city}, 
        user_name = ${req.body.user_name}, 
        user_province = ${req.body.user_province},
        user_mobile = ${req.body.user_mobile}
        where user_id = ${req.params.userId}
        `;
    const result = await pool.query`
        select user_name,user_province,user_city,user_mobile from 
        users
        where user_id = ${req.params.userId}
        `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
