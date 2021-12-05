const sql = require("mssql/msnodesqlv8");
const config = require("./config");

const sqldb = new sql.connect(config);

console.log("connect to sqlserver");

module.exports = sqldb;
