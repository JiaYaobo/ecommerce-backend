const router = require("express").Router();
const sqldb = require("../sqldb");

//ADD PRODUCT TO CART
router.post("/", async (req, res) => {
  try {
    // need to add status column
    const pool = await sqldb;
    await pool.query`insert into 
        Orders 
        (user_id, store_id, goods_id, goods_num, goods_ship_cost, order_time, order_status, order_expect_time) 
        values(${req.body.user_id},${req.body.store_id},${req.body.goods_id},${
      req.body.goods_num
    },${req.body.goods_ship_cost},${req.body.order_time},${0},${
      req.body.order_expect_time
    }) 
        `;
    res.status(200).send("add to cart successfully");
  } catch (err) {
    console.log(err);
  }
});

//DELETE PRODUCT FROM CART
router.post("/:order_id", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`delete from orders where order_id = ${req.params.order_id} `;
    res.status(200).send("add to cart successfully");
  } catch (err) {
    console.log(err);
  }
});
