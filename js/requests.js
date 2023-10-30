const { dbConnection } = require("../app.js");
const Table = require("easy-table");


// Function to retrieve and display all departments
const viewAllDepartments = async () => {
  try {
    const [rows] = await dbConnection
      .promise()
      .query("SELECT * FROM department");
    console.log(rows);

    // Create a new table
    const table = new Table();

    rows.forEach((department) => {
      table.cell("ID", department.id);
      table.cell("Name", department.name);
      table.newRow();
    });

    // Display the table of departments
    console.log(table.toString());
  } catch (err) {
    console.error("Error:", err);
  }
};

// Function to retrieve and display all roles
const viewAllRoles = async () => {
  try {
    const [rows] = await dbConnection.promise().query(`
      SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role
      JOIN department ON role.department_id = department.id
    `);

    // Create a new table
    const table = new Table();

    rows.forEach((role) => {
      table.cell("ID", role.id);
      table.cell("Title", role.title);
      table.cell("Department", role.department);
      table.cell("Salary", role.salary);
      table.newRow();
    });

    // Display the table of roles
    console.log(table.toString());
  } catch (err) {
    console.error("Error:", err);
  }
};

// Function to retrieve and display all employees
const viewAllEmployees = async () => {
  try {
    const [rows] = await dbConnection.promise().query(`
      SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name, 
      CONCAT(m.first_name, " ", m.last_name) AS manager
      FROM employees e
      JOIN role r ON r.id = e.role_id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employees m ON m.id = e.manager_id
    `);

    // Create a new table
    const table = new Table();

    rows.forEach((employee) => {
      table.cell("ID", employee.id);
      table.cell("First Name", employee.first_name);
      table.cell("Last Name", employee.last_name);
      table.cell("Title", employee.title);
      table.cell("Salary", employee.salary);
      table.cell("Department", employee.name);
      table.cell("Manager", employee.manager || "null");
      table.newRow();
    });

    // Display the table of employees
    console.log(table.toString());
  } catch (err) {
    console.error("Error:", err);
  }
};

// Function to add a department to the database
const addDepartment = async (name) => {
  try {
    await dbConnection
      .promise()
      .query("INSERT INTO department (name) VALUES (?)", [name]);
    console.log(`Added ${name} to the database`);
  } catch (err) {
    console.error("Error:", err);
  }
};

// Function to get departments list from the database
const getDepartmentsList = async () => {
  try {
    const [rows] = await dbConnection
      .promise()
      .query("SELECT name FROM department");
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
    const [departmentRows] = await dbConnection
      .promise()
      .query("SELECT id FROM department WHERE name = ?", [departmentName]);

    if (departmentRows.length === 0) {
      console.error("Department not found.");
      return;
    }

    const departmentId = departmentRows[0].id;

    await dbConnection
      .promise()
      .query(
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
