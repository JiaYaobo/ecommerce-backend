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

// get overview comment
router.get("/overview/:productId", async (req, res) => {
  try {
    const pool = await sqldb;

    let star5 = await pool.query`
    select Orders.goods_id, count(*) num
from Orders, Comments
where Orders.comment_status = 1 and Orders.order_id = Comments.order_id and Comments.comment_rating = 5 and goods_id = ${req.params.productId}
group by orders.goods_id
    `;
    star5 = star5.recordset.length == 0 ? 0 : star5.recordset[0].num;

    let star4 = await pool.query`
    select Orders.goods_id, count(*) num
from Orders, Comments
where Orders.comment_status = 1 and Orders.order_id = Comments.order_id and Comments.comment_rating = 4 and goods_id = ${req.params.productId}
group by orders.goods_id
    `;
    star4 = star4.recordset.length == 0 ? 0 : star4.recordset[0].num;

    let star3 = await pool.query`
    select Orders.goods_id, count(*) num
from Orders, Comments
where Orders.comment_status = 1 and Orders.order_id = Comments.order_id and Comments.comment_rating = 3 and goods_id = ${req.params.productId}
group by orders.goods_id
    `;
    star3 = star3.recordset.length == 0 ? 0 : star3.recordset[0].num;
    let star2 = await pool.query`
    select Orders.goods_id, count(*) num
from Orders, Comments
where Orders.comment_status = 1 and Orders.order_id = Comments.order_id and Comments.comment_rating = 2 and goods_id = ${req.params.productId}
group by orders.goods_id
    `;
    star2 = star2.recordset.length == 0 ? 0 : star2.recordset[0].num;

    let star1 = await pool.query`
    select Orders.goods_id, count(*) num
from Orders, Comments
where Orders.comment_status = 1 and Orders.order_id = Comments.order_id and Comments.comment_rating = 1 and goods_id = ${req.params.productId}
group by orders.goods_id
    `;
    star1 = star1.recordset.length == 0 ? 0 : star1.recordset[0].num;

    let total = 0;

    if (star1 + star2 + star3 + star4 + star5 === 0) {
      total = 0;
    } else {
      total =
        (star1 + 2 * star2 + 3 * star3 + 4 * star4 + 5 * star5) /
        (star1 + star2 + star3 + star4 + star5);
    }
    const data = {
      star1: star1,
      star2: star2,
      star3: star3,
      star4: star4,
      star5: star5,
      total: total,
    };

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
