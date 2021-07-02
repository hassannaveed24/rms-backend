const mysql = require('mysql2/promise')
const config = require("../config.json")
const connection = mysql.createConnection(config.database)
if (connection) {
    console.log(`Connected to MySQL host: ${config.database.host}`)            
}

module.exports = connection