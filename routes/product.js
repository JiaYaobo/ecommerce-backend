const router = require("express").Router();
const sqldb = require("../sqldb");

// CREATE NEW PRODUCT
router.post("/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`insert into 
        Goods 
        (goods_id, goods_name, store_id, created_at, goods_price, goods_stock, goods_info, goods_image, goods_brand, goods_func)
        values(1001,${req.body.goods_name}, ${req.params.storeId}, getdate(), ${req.body.goods_price}, ${req.body.goods_stock}, ${req.body.goods_info}, ${req.body.goods_image}, ${req.body.goods_brand}, ${req.body.goods_func} )`;
    const result = await pool.query`
    select Top 1 *
    from goods
    where goods.store_id = ${req.params.storeId}
    order by goods_id desc
    `;
    const data = await result.recordset[0];
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
  }
});

//DELETE A PRODUCT
router.delete("/:productId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`delete from goods where goods_id = ${req.params.productId}`;
    res.status(200).send("delete product successful");
  } catch (err) {
    console.log(err);
  }
});

//GET A PRODUCT
router.get("/:productId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result =
      await pool.query`select * from goods where goods_id = ${req.params.productId}`;
    const product = result.recordset[0];
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

//get 10 products
router.get("/featured_products/10", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select top 10 *
    from goods
    `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get all products
router.get("/products/all", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select *
    from goods
    `;
    const data = result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get all products by a store
router.get("/products/store/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select goods.* from 
    goods
    where goods.store_id = ${req.params.storeId}
    `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//update a product
router.post("/update/:productId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
   update
   goods
   set goods_price = ${req.body.goods_price}, goods_name=${req.body.goods_name}, goods_status = ${req.body.goods_status}
   where goods_id = ${req.params.productId}
  `;
    const result = await pool.query`
  select * from
  goods
  where goods_id = ${req.params.productId}
  `;
    const data = result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get goods by search query
router.post("/search_goods/search", async (req, res) => {
  try {
    const pool = await sqldb;
    let string = await req.body.query.toLowerCase();
    string = await ("%" + string + "%");
    const result = await pool.query`
    select *
    from goods
    where lower(goods_name) like ${string} or 
    lower(goods_brand) like ${string} or
     lower(goods_info) like ${string}
    `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
