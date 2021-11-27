const router = require("express").Router();
const sqldb = require("../sqldb");

router.get("/", async (req, res) => {
  try {
    const pool = await sqldb;
    const result = await pool.query`SELECT Name from sys.Databases`;
    res.status(200).json(result.recordsets[0][0]);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
