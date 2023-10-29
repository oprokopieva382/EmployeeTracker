const express = require("express");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 3001;
const app = express();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {dbConnection, connectedToDataBase}