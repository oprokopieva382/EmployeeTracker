const mysql = require("mysql2/promise");

// Create a connection pool
const dbConnection = mysql.createPool(
  {
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "employeetracker_db",
  },
  console.log(`Connected to the employeetracker_db database.`),
 
);

module.exports = { dbConnection };