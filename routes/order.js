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
router.delete("/:order_id", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`delete from orders where order_id = ${req.params.order_id} `;
    res.status(200).send("add to cart successfully");
  } catch (err) {
    console.log(err);
  }
});

//GET ALL ORDERS BY A USER
router.get("/all/:user_id", async (req, res) => {
  try {
    const pool = await sqldb;
    let inCart =
      await pool.query`select * from orders where user_id = ${req.params.user_id} and order_status = 0`;
    let inTrans =
      await pool.query`select * from orders where user_id = ${req.params.user_id} and order_status = 1 `;
    let inFinished =
      await pool.query`select * from orders where user_id = ${req.params.user_id} and order_status = 2 `;
    inCart = await inCart.recordsets[0];
    inTrans = await inTrans.recordsets[0];
    inFinished = await inFinished.recordsets[0];
    data = { inCart: inCart, inTrans: inTrans, inFinished: inFinished };
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//GET A PRODUCT INFO COMBINED ORDER INFO FROM ORDER
router.get("/cart_product_info/:orderId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select orders.*, goods.goods_image, goods.goods_name,goods.goods_price
    from orders, goods
    where orders.goods_id = goods.goods_id and orders.order_id = ${req.params.orderId}
    `;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
