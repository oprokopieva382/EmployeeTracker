const mysql = require("mysql2");

// Create a connection
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "employeetracker_db",
});

module.exports = { dbConnection };
