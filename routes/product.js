const router = require("express").Router();
const sqldb = require("../sqldb");

// CREATE NEW PRODUCT
router.post("/", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`insert into 
        Goods 
        (goods_name, store_id, goods_price, goods_info, goods_image, goods_size, goods_brand, goods_func)
        values()`;
    res.status(200).send("create a new product");
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
    console.log(result.recordset[0]);
    const product = result.recordset[0];
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
