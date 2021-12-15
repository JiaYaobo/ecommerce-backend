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

// get favorite goods
router.get("/fav/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select top 1 goods.goods_id,goods_name,goods_image, count(*) num
from goods,users,Orders
where goods.goods_id = orders.goods_id and orders.user_id = users.user_id and users.user_id = ${req.params.userId} and order_status <> 0
group by goods.goods_id,goods_name,goods_image
order by num desc
    `;
    const data = result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get favorite store
router.get("/fav_store/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select top 1 users.user_name, users.user_profile, count(*) num
from orders, users
where orders.store_id = Users.user_id and orders.user_id = ${req.params.userId}
group by users.user_name, users.user_profile
order by num desc
    `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get favorite brand
router.get("/fav_brand/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select goods.goods_brand, count(*) num
from orders, goods, users
where goods.goods_id = orders.goods_id and orders.user_id = users.user_id and users.user_id = ${req.params.userId} and order_status <> 0
group by goods.goods_brand
order by num desc
    `;
    const data = result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
