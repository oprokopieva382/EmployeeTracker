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

// Function to retrieve and display all roles
const viewAllRoles = async () => {
  try {
    const [rows] = await dbConnection.execute(
      `SELECT role.id, role.title, department.name AS department, role.salary FROM role
      JOIN department
      ON role.department_id = department.id`
    );

    //display
    console.log("");
    console.log("id   title                  department     salary");
    console.log("__  _____________________  ______________  ______");
    rows.map((role) => {
      const formattedId = role.id.toString().padStart(2, " ");
      const formattedTitle = role.title.padEnd(20, " ");
      const formattedSalary = role.salary.padStart(6, " ");
      const formattedDepartment = role.department.padEnd(14, " ");
      console.log(
        `${formattedId}   ${formattedTitle}  ${formattedDepartment}  ${formattedSalary}`
      );
    });
  } catch (err) {
    console.error("Error:", err);
  }
};

module.exports = { viewAllDepartments, viewAllRoles };
