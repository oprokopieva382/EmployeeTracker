const { dbConnection } = require("../app.js");

// Function to retrieve and display all departments
const viewAllDepartments = async () => {
  try {
    const [rows] = await dbConnection.execute("SELECT * FROM department");

    //display
     console.log("");
    console.log("id", "name");
    console.log("__", "___________");
    rows.map((department) => {
      console.log(`${department.id}  ${department.name}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
};

module.exports = { viewAllDepartments };
