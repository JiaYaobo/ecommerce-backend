const router = require("express").Router();
const sqldb = require("../sqldb");

// CREATE COMMENT SINGLE
router.post("/", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`insert 
    into
     Comments(order_id, created_at, comment_rating, comment_text) 
     values (${req.body.order_id}, getdate(), ${req.body.comment_rating}, ${req.body.comment_text}) `;
    await pool.query`
     update orders
     set comment_status = 1
     where order_id = ${req.body.order_id}
     `;
    res.status(200).send("success publish comment");
  } catch (err) {
    console.log(err);
  }
});

// CREATE COMMENT
router.post("/:comment_id", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`insert into Comments(order_id, comment_time, comment_rating, comment_text, follow_comment_id) values (${req.body.order_id}, ${req.body.comment_time}, ${req.body.comment_rating}, ${req.body.comment_text}, ${req.params.comment_id}) `;
    res.status(200).send(`success comment ${req.params.comment_id}`);
  } catch (err) {
    console.log(err);
  }
});

//delete a comment
router.delete("/:comment_id", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`delete from comments where comment_id = ${req.params.comment_id}`;
    res.status(200).send("delete comment successful");
  } catch (err) {
    console.log(err);
  }
});

// 存在问题 一个用户喜欢或者不喜欢多次无法处理，并且可以同时喜欢不喜欢，需要加一张表

//like a comment
router.post("/like/:comment_id", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`update  comments set comment_likes=comment_likes+1 where comment_id = ${req.params.comment_id}`;
    res.status(200).send(`like comment ${req.params.comment_id}`);
  } catch (err) {
    console.log(err);
  }
});

//get comments by goods_id
router.get("/comments/:goodsId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select comments.*, users.user_name, users.user_profile
    from comments, goods, orders, users
    where comments.order_id = orders.order_id and
     orders.goods_id = goods.goods_id and
     orders.user_id = users.user_id and goods.goods_id = ${req.params.goodsId}
    `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
