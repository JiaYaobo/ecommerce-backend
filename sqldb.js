const sql = require("mssql");
const config = require("./config");

const sqldb = new sql.connect(config);

console.log("connect to sqlserver");

module.exports = sqldb;
