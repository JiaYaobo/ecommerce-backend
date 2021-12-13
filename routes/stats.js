const router = require("express").Router();
const sqldb = require("../sqldb");

//用户各个季度的消费
router.get("/season_stats/user/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    let season1 = await pool.query`
        SELECT sum(order_total) cost_total_season_one
        FROM Users u LEFT JOIN Orders o on(u.user_id=o.user_id)/*null加和就是没有 这样排除一下没有消费的用户*/
        WHERE  (create_at BETWEEN convert(varchar(10),'2021-01-01',120) AND convert(varchar(10),'2021-04-01',120)) AND o.order_status<>1 AND u.user_status=1 AND u.user_id = ${req.params.userId}
        GROUP BY u.user_id
        ORDER BY cost_total_season_one
        `;
    season1 = await season1.recordset[0];

    let season2 = await pool.query`
    SELECT sum(order_total) cost_total_season_two
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.user_id)/*null加和就是没有 这样排除一下没有消费的用户*/
    WHERE  (create_at BETWEEN convert(varchar(10),'2021-04-01',120) AND convert(varchar(10),'2021-07-01',120)) AND o.order_status<>1 AND u.user_status=1 AND u.user_id = ${req.params.userId}
    GROUP BY u.user_id
    ORDER BY cost_total_season_two
    `;
    season2 = await season2.recordset[0];

    let season3 = await pool.query`
    SELECT sum(order_total) cost_total_season_three
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.user_id)/*null加和就是没有 这样排除一下没有消费的用户*/
    WHERE  (create_at BETWEEN convert(varchar(10),'2021-07-01',120) AND convert(varchar(10),'2021-10-01',120)) AND o.order_status<>1 AND u.user_status=1 AND u.user_id = ${req.params.userId}
    GROUP BY u.user_id
    ORDER BY cost_total_season_three
    `;
    season3 = await season3.recordset[0];

    let season4 = await pool.query`
    SELECT sum(order_total) cost_total_season_four
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.user_id)/*null加和就是没有 这样排除一下没有消费的用户*/
    WHERE  (create_at BETWEEN convert(varchar(10),'2021-10-01',120) AND convert(varchar(10),'2022-01-01',120)) AND o.order_status<>1 AND u.user_status=1 AND u.user_id = ${req.params.userId}
    GROUP BY u.user_id
    ORDER BY cost_total_season_four
    `;
    season4 = await season4.recordset[0];
    let data = [
      { name: "Season1", cost: season1.cost_total_season_one },
      { name: "Season2", cost: season2.cost_total_season_two },
      { name: "Season3", cost: season3.cost_total_season_three },
      { name: "Season4", cost: season4.cost_total_season_four },
    ];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//商家一年销售
router.get("/year_stats/store/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    SELECT u.user_id ,sum(order_total) sales_total_year
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.store_id)
    WHERE u.user_status=2  AND (create_at BETWEEN convert(varchar(10),'2021-01-01',120) AND convert(varchar(10),'2022-01-01',120)) AND order_status<>0 and u.user_id = ${req.params.storeId}
    GROUP BY u.user_id
    ORDER BY sales_total_year
    `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//商店各个季度销售
router.get("/season_stats/store/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    let season1 = await pool.query`
        SELECT sum(order_total) cost_total_season_one
        FROM Users u LEFT JOIN Orders o on(u.user_id=o.store_id)/*null加和就是没有 这样排除一下没有消费的用户*/
        WHERE  (create_at BETWEEN convert(varchar(10),'2021-01-01',120) AND convert(varchar(10),'2021-04-01',120)) AND o.order_status<>1 AND u.user_status=2 AND u.user_id = ${req.params.storeId}
        GROUP BY u.user_id
        ORDER BY cost_total_season_one
        `;
    season1 = await season1.recordset[0];

    let season2 = await pool.query`
    SELECT sum(order_total) cost_total_season_two
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.store_id)/*null加和就是没有 这样排除一下没有消费的用户*/
    WHERE  (create_at BETWEEN convert(varchar(10),'2021-04-01',120) AND convert(varchar(10),'2021-07-01',120)) AND o.order_status<>1 AND u.user_status=2 AND u.user_id = ${req.params.storeId}
    GROUP BY u.user_id
    ORDER BY cost_total_season_two
    `;
    season2 = await season2.recordset[0];

    let season3 = await pool.query`
    SELECT sum(order_total) cost_total_season_three
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.store_id)/*null加和就是没有 这样排除一下没有消费的用户*/
    WHERE  (create_at BETWEEN convert(varchar(10),'2021-07-01',120) AND convert(varchar(10),'2021-10-01',120)) AND o.order_status<>1 AND u.user_status=2 AND u.user_id = ${req.params.storeId}
    GROUP BY u.user_id
    ORDER BY cost_total_season_three
    `;
    season3 = await season3.recordset[0];

    let season4 = await pool.query`
    SELECT sum(order_total) cost_total_season_four
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.store_id)/*null加和就是没有 这样排除一下没有消费的用户*/
    WHERE  (create_at BETWEEN convert(varchar(10),'2021-10-01',120) AND convert(varchar(10),'2022-01-01',120)) AND o.order_status<>1 AND u.user_status=2 AND u.user_id = ${req.params.storeId}
    GROUP BY u.user_id
    ORDER BY cost_total_season_four
    `;
    season4 = await season4.recordset[0];
    let data = [
      { name: "Season1", sale: season1.cost_total_season_one },
      { name: "Season2", sale: season2.cost_total_season_two },
      { name: "Season3", sale: season3.cost_total_season_three },
      { name: "Season4", sale: season4.cost_total_season_four },
    ];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//商店总vip数
router.get("/vip_stats/store/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
      select count(*) vip_num
      from vip
      where vip.store_id = ${req.params.storeId}
    `;
    const data = result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//商店订单数
router.get("/order_stats/store/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
      select count(*) order_num
      from orders
      where orders.store_id = ${req.params.storeId} and orders.order_status <> 0
    `;
    const data = result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/province", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
  SELECT u.user_province ,AVG(order_total) cost_average,max(order_total) cost_max,min(order_total) cost_min
FROM Users u LEFT JOIN Orders o on(u.user_id=o.user_id)/*null加和就是没有 这样排除一下没有消费的用户*/
WHERE u.user_status=1 AND o.order_status<>0/*现在最新orders表还是只有0/1状态*/
GROUP BY u.user_province
ORDER BY cost_average desc
    `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get store top 3 sales of goods
router.get("/store/top3/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    SELECT w.user_id,w.user_name,w.goods_name,w.goods_image
    FROM(
        SELECT g.goods_name goods_name,g.goods_image goods_image, u.user_id user_id,u.user_name user_name,row_number () OVER
        (PARTITION BY u.user_id ORDER by o.goods_total desc) rn--以user_id分组，分组内以降序排列求每组中各自的序号
        FROM Users u LEFT JOIN Goods g on(u.user_id=g.store_id),(SELECT goods_id,sum(goods_num) goods_total FROM Orders GROUP BY goods_id) o
        WHERE g.goods_id=o.goods_id and u.user_status=2) w
    WHERE w.rn <=3 and w.user_id = ${req.params.storeId}
    ORDER BY w.user_id;
    `;
    const data = await result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get store avg rating
router.get("/store/avg_rate/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    SELECT user_id,w.rating_all
    FROM(
    SELECT u.user_id,avg(comment_rating) rating_all,row_number() OVER
    (PARTITION BY u.user_id ORDER by avg(comment_rating) desc) rn--以m分组，分组内以n倒序排列求每组中各自的序号
    from Users u LEFT JOIN Orders o on(u.user_id=o.store_id),Comments c
    where c.order_id=o.order_id and u.user_status=2 AND (create_at BETWEEN convert(varchar(10),'2021-01-01',120) AND convert(varchar(10),'2022-01-01',120)) AND order_status<>1 and u.user_id=${req.params.storeId}
    GROUP BY u.user_id
    ) w
    where w.rn <=10
    order by rating_all desc
    `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get best rating goods of a store
router.get("/store/best_goods/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    WITH m as(SELECT u.user_id user_id,g.goods_name goods_name,g.goods_image good_image,avg(comment_rating) rating
    FROM Users u LEFT JOIN Orders o on(u.user_id=o.store_id),Goods g,Comments c
    WHERE c.order_id=o.order_id and o.goods_id=g.goods_id
    GROUP BY u.user_id,g.goods_name, g.goods_image)
    SELECT a.user_id,a.goods_name, a.good_image
    FROM (select row_number() OVER
        (PARTITION BY m.user_id ORDER by m.rating desc)rn,m.user_id,m.goods_name, m.good_image
        FROM m where m.user_id = ${req.params.storeId})a
    WHERE a.rn=1
    `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
