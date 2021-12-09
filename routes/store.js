const router = require("express").Router();
const sqldb = require("../sqldb");

// get store name by id
router.get("/store_name/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
            select users.user_name
            from users
            where users.user_id = ${req.params.storeId}
        `;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get store info
router.get("/store_info/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select *
    from users
    where user_id = ${req.params.storeId}
    `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get store province and city
router.get("/store_place/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select user_province, user_city
    from users
    where user_id = ${req.params.storeId}    
    `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
