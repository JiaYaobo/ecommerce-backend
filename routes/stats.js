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

module.exports = router;
