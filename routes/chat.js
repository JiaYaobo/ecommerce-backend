const router = require("express").Router();
const sqldb = require("../sqldb");

// create a conversation between user and store
router.post("/create_conversation/:userId/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select *
    from conversation
    where user_id = ${req.params.userId} and store_id = ${req.params.storeId}
    `;
    const data = await result.recordset;
    if (data.length === 0) {
      try {
        await pool.query`
        insert into
        conversation (user_id, store_id, created_at)
        values(${req.params.userId}, ${req.params.storeId}, getdate())
        `;
        res.status(200).send("create a conversation successfully");
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(200).send("conversation has been created before");
    }
  } catch (err) {
    console.log(err);
  }
});

// get all conversations by user id
router.get("/conversations_all/:userId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
        select *
        from conversation
        where conversation.user_id = ${req.params.userId} 
        `;
    const data = result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/conversations_all/store/:storeId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
    select *
    from conversation
    where conversation.store_id = ${req.params.storeId} 
    `;
    const data = result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get store info by conversation id
router.get("/store_info/:conversationId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
        select users.user_id, users.user_name
        from users, conversation
        where users.user_id = conversation.store_id and
            conversation.conversation_id = ${req.params.conversationId}
        `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//get user info by conversation id
router.get("/user_info/:conversationId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
        select users.user_id, users.user_name
        from users, conversation
        where users.user_id = conversation.user_id and
            conversation.conversation_id = ${req.params.conversationId}
        `;
    const data = await result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

// get messages from conversation
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`
        select * from
        message
        where message.conversation_id = ${req.params.conversationId}
        order by created_at asc
        `;
    const data = result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

//new message
router.post("/messages", async (req, res) => {
  try {
    const pool = await sqldb;
    await pool.query`
        insert into 
        message(sender_id, receiver_id, created_at, message_text, conversation_id)
        values(${req.body.sender_id},${req.body.receiver_id},getdate(),${req.body.message_text},${req.body.conversation_id})
    `;
    const result = await pool.query`
    select top 1 *
    from message
    where conversation_id = ${req.body.conversation_id}
    order by message_id desc
    `;
    const data = result.recordset[0];
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
