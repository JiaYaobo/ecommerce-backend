const router = require("express").Router();
const sqldb = require("../sqldb");

//get discount by store and user
router.get("/discount/:userId/:productId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
        select discount
        from vip, goods
        where vip.store_id = goods.store_id and
              goods.goods_id =  ${req.params.productId} and
              vip.user_id = ${req.params.userId}
        `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
