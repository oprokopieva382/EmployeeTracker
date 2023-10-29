const mysql = require("mysql2/promise");

// Connect to database
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "",
});

const connectedToDataBase = async () => {
  try {
    await dbConnection.connect();
    console.log(`Connected to the database.`);
  } catch (err) {
    console.error("Database connection failed: " + err.stack);
  }
};

module.exports = {dbConnection, connectedToDataBase}