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
router.delete("/:goods_id", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`delete from goods where goods_id = ${req.params.goods_id}`;
    res.status(200).send("delete product successful");
  } catch (err) {
    console.log(err);
  }
});
