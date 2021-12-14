const router = require("express").Router();
const sqldb = require("../sqldb");

//create a vip
router.post("/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    let id = await pool.query`
      select user_id
      from users
      where users.user_email like ${req.body.user_email}
    `;
    id = id.recordset[0];
    await pool.query`
    insert into 
    VIP (vip_type, user_id, store_id, discount)
    values(${req.body.vip_type},${id.user_id}, ${req.params.storeId}, ${req.body.discount} )
    `;
    res.status(200).json("create vip successfully");
  } catch (err) {
    console.log(err);
  }
});

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

//get vip info
router.get("/info/:vipId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
      select users.user_name, vip.vip_type, vip.discount
      from users, vip
      where users.user_id = vip.user_id and users.user_id = ${req.params.vipId}
    `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//update vip info
router.post("/update/:vipId", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
    update
    vip
    set vip_type = ${req.body.vip_type}, discount = ${req.body.discount}
    where user_id = ${req.params.vipId}
    `;
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
