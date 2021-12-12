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

//get fnished orders by a user
router.get("/finished_orders/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select * from orders
    where orders.store_id = ${req.params.storeId} and orders.order_status = 3
    `;
    const data = await result.recordsets[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get trans orders by a store
router.get("/trans_orders/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select * from orders
    where orders.store_id = ${req.params.storeId} and orders.order_status = 2
    `;
    const data = await result.recordsets[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get wait orders by a store
router.get("/wait_orders/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select * from orders
    where orders.store_id = ${req.params.storeId} and orders.order_status = 1
    `;
    const data = await result.recordsets[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get all vips
router.get("/vips_all/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select users.user_name, users.user_id, vip.vip_type, vip.discount , users.user_profile
    from users, vip
    where vip.user_id = users.user_id and vip.store_id = ${req.params.storeId}
    `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
