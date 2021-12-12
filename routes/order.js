const router = require("express").Router();
const sqldb = require("../sqldb");

//ADD PRODUCT TO CART
router.post("/add_to_cart", async (req, res) => {
  try {
    // need to add status column
    const pool = await sqldb;
    await pool.query`
        insert into 
        Orders 
        (user_id, 
          store_id, 
          goods_id, 
          goods_num, 
          goods_ship_cost,
          goods_size, 
          goods_color, 
          order_total,
          create_at, 
          order_status, 
          order_expect_time
          ) 
        values(
          ${req.body.user_id},
          ${req.body.store_id},
          ${req.body.goods_id},
          ${req.body.goods_num},
          ${req.body.goods_ship_cost},
          ${req.body.goods_size},
          ${req.body.goods_color},
          ${req.body.order_total},
          getdate(),
          ${0},
          ${req.body.order_expect_time})`;
    const result = await pool.query`
    select Top 1 * from orders
    where orders.user_id = ${req.body.user_id} and 
    orders.store_id = ${req.body.store_id} and 
    orders.goods_id = ${req.body.goods_id}
    order by order_id desc 
    `;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//DELETE PRODUCT FROM CART
router.delete("/cart_orders/:order_id", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`delete 
    from 
    orders 
    where order_id = ${req.params.order_id} `;
    res.status(200).send("delete from cart successfully");
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
    let inWait =
      await pool.query`select * from orders where user_id = ${req.params.user_id} and order_status = 1`;
    let inTrans =
      await pool.query`select * from orders where user_id = ${req.params.user_id} and order_status = 2 `;
    let inFinished =
      await pool.query`select * from orders where user_id = ${req.params.user_id} and order_status = 3 `;
    inCart = await inCart.recordsets[0];
    inWait = await inWait.recordsets[0];
    inTrans = await inTrans.recordsets[0];
    inFinished = await inFinished.recordsets[0];
    data = {
      inCart: inCart,
      inWait: inWait,
      inTrans: inTrans,
      inFinished: inFinished,
    };
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get cart orders by a user
router.get("/cart_orders/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select * from orders
    where orders.user_id = ${req.params.userId} and orders.order_status = 0
    `;
    const data = await result.recordsets[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//add one on cart order
router.post("/cart_orders/add/:orderId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
    update orders
    set orders.goods_num = orders.goods_num + 1 , orders.order_total = orders.order_total + (select goods_price from goods where goods.goods_id = orders.goods_id )
    where orders.order_id = ${req.params.orderId}
    `;
    const result = await pool.query`
    select * from orders where orders.order_id = ${req.params.orderId}`;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

router.post("/cart_orders/remove/:orderId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
    update orders
    set orders.goods_num = orders.goods_num - 1 , orders.order_total = orders.order_total - (select goods_price from goods where goods.goods_id = orders.goods_id )
    where orders.order_id = ${req.params.orderId}
    `;
    const result = await pool.query`
    select * from orders where orders.order_id = ${req.params.orderId}`;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get wait orders by a user
router.get("/wait_orders/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select * from orders
    where orders.user_id = ${req.params.userId} and orders.order_status = 1
    `;
    const data = await result.recordsets[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get trans orders by a user
router.get("/trans_orders/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select * from orders
    where orders.user_id = ${req.params.userId} and orders.order_status = 2
    `;
    const data = await result.recordsets[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//add wait order from cart
router.post("/add_to_wait", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
    update
    orders
    set order_status = 1
    where orders.order_id = ${req.body.orderId}
    `;
    const result = await pool.query`
    select * from orders
    where orders.order_id = ${req.body.orderId}
    `;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//add trans order from wait
router.post("/add_to_trans", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
    update
    orders
    set order_status = 2
    where orders.order_id = ${req.body.orderId}
    `;
    await pool.query`
    update
    goods
    set goods.goods_stock = goods.goods_stock-1
    where goods.goods_id = (select orders.goods_id
      from orders
      where orders.order_id = ${req.body.orderId}
      ) 
    `;
    const result = await pool.query`
    select * from orders
    where orders.order_id = ${req.body.orderId}
    `;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get fnished orders by a user
router.get("/finished_orders/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select * from orders
    where orders.user_id = ${req.params.userId} and orders.order_status = 3
    `;
    const data = await result.recordsets[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//GET A PRODUCT INFO COMBINED ORDER INFO FROM ORDER
router.get("/product_info/:orderId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select goods.goods_image, goods.goods_name,goods.goods_price,users.user_name,goods.store_id,goods.goods_id
    from orders, goods, users
    where orders.goods_id = goods.goods_id and 
    goods.store_id = users.user_id and
    orders.order_id = ${req.params.orderId}
    `;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

// cancel a trans order
router.delete("/cancel/:orderId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
    delete
    from orders
    where order_id = ${req.params.orderId}
    `;
    res.status(200).send("cancel order successfully");
  } catch (err) {
    console.log(err);
  }
});

//confirm trans order to finished orders
router.post("/finish/:orderId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
    update orders
    set orders.order_status = 3
    where orders.order_id = ${req.params.orderId} and orders.order_status = 2
    `;
    const result = await pool.query` 
    select * from orders
    where orders.order_id = ${req.params.orderId}
    `;
    const data = await result.recordsets[0][0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//GET ALL ORDERS BY A Store
router.get("/all/store/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    let inWait =
      await pool.query`select * from orders where user_id = ${req.params.storeId} and order_status = 1`;
    let inTrans =
      await pool.query`select * from orders where user_id = ${req.params.storeId} and order_status = 2 `;
    let inFinished =
      await pool.query`select * from orders where user_id = ${req.params.storeId} and order_status = 3 `;
    inWait = await inWait.recordsets[0];
    inTrans = await inTrans.recordsets[0];
    inFinished = await inFinished.recordsets[0];
    data = {
      inWait: inWait,
      inTrans: inTrans,
      inFinished: inFinished,
    };
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//delete a order
router.delete("/delete_order/:orderId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
  delete
  from orders
  where order_id = ${req.params.orderId}
  `;
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
