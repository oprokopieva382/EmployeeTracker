const { dbConnection } = require("../app.js");

// Function to retrieve and display all departments
const viewAllDepartments = async () => {
  try {
    const [rows] = await dbConnection.execute("SELECT * FROM department");

    //display
    console.log("");
    console.log("id", "name");
    console.log("--", "-----------");
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
    console.log("--  ---------------------  --------------  ------");
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

// Function to retrieve and display all roles
const viewAllEmployees = async () => {
  try {
    const [rows] = await dbConnection.execute(
      `SELECT e.id, e.first_name, e.last_name, 
      r.title, r.salary, d.name, 
      CONCAT(m.first_name, " ", m.last_name) AS manager
      FROM employees e
      JOIN role r ON r.id = e.role_id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employees m ON m.id = e.manager_id
      `
    );

    //display
    console.log("");
    console.log(
      "id  first_name   last_name   title                  department   salary   manager"
    );
    console.log(
      "--  -----------  ----------  -------------------  ------------   -------  --------"
    );
    rows.map((employee) => {
      const formattedId = employee.id.toString().padStart(2, " ");
      const formattedFirstName = employee.first_name.padEnd(11, " ");
      const formattedLastName = employee.last_name.padEnd(10, " ");
      const formattedTitle = employee.title.padEnd(20, " ");
      const formattedSalary = employee.salary.padStart(6, " ");
      const formattedDepartment = employee.name.padEnd(12, " ");
      const formattedManager = employee.manager ? employee.manager : "null";
      console.log(
        `${formattedId}  ${formattedFirstName}  ${formattedLastName}  ${formattedTitle}  ${formattedDepartment}   ${formattedSalary}  ${formattedManager}`
      );
    });
  } catch (err) {
    console.error("Error:", err);
  }
};

// Function to add a department to the database
const addDepartment = async (name) => {
  try {
    await dbConnection.execute("INSERT INTO department (name) VALUES (?)", [
      name,
    ]);
    console.log(`Added ${name} to the database`);
  } catch (err) {
    console.error("Error:", err);
  }
};

// Function to get departments list from the database
const getDepartmentsList = async () => {
  try {
    const [rows] = await dbConnection.execute("SELECT name FROM department");
    return rows;
  } catch (err) {
    console.error("Error fetching departments:", err);
    return [];
  }
};

// Function to add a role to the database
const addRole = async (info) => {
  const { roleTitle, roleSalary, departmentName } = info;

  try {
    const [departmentRows] = await dbConnection.execute(
      "SELECT id FROM department WHERE name = ?",
      [departmentName]
    );

    if (departmentRows.length === 0) {
      console.error("Department not found.");
      return;
    }
  
    const departmentId = departmentRows[0].id;

    await dbConnection.execute(
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
      [roleTitle, roleSalary, departmentId]
    );
    console.log(`Added ${roleTitle} to the database`);
  } catch (err) {
    console.error("Error:", err);
  }
};

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  getDepartmentsList,
};
