const { dbConnection } = require("../app.js");
const Table = require("easy-table");

// Function to retrieve and display all departments
const viewAllDepartments = async () => {
  try {
    const [rows] = await dbConnection
      .promise()
      .query("SELECT * FROM department");
  
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

// Function to retrieve and display employees by manager
const viewEmployeesByManager = async (managerInfo) => {
  try {
    const { managerListInfo } = managerInfo;
    // Get the manager ID based on their full name
    const [managerRows] = await dbConnection
      .promise()
      .query(
        "SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?",
        [managerListInfo]
      );
    if (managerRows.length === 0) {
      console.error("Manager not found.");
      return;
    }

    const managerId = managerRows[0].id;

    // Get the employees who have the selected manager
    const [rows] = await dbConnection.promise().query(
      `
      SELECT e.first_name, e.last_name,
      CONCAT(e.first_name, " ", e.last_name) AS employee
      FROM employees e
      WHERE e.manager_id =?
    `,
      [managerId]
    );

    // Create a new table
    const table = new Table();

    rows.forEach((employee) => {
      table.cell("First name", employee.first_name);
      table.cell("Last name", employee.last_name);
      table.newRow();
    });

    // Display the table of employees
    console.log(table.toString());
  } catch (err) {
    console.error("Error:", err);
  }
};

// Function to retrieve and display employees by department
const viewEmployeesByDepartment = async (departmentInfo) => {
  try {
    const { departmentName } = departmentInfo;
    // Get the role IDs of employees in the selected department
    const [roleRows] = await dbConnection
      .promise()
      .query(
        "SELECT role.id FROM role " +
          "JOIN department ON role.department_id = department.id " +
          "WHERE department.name = ?",
        [departmentName]
      );

    if (roleRows.length === 0) {
      console.error("No employees found in the selected department.");
      return;
    }

    const roleIds = roleRows.map((role) => role.id);

    // Get the employees with the selected role IDs
    const [rows] = await dbConnection.promise().query(
      `
      SELECT e.first_name, e.last_name
      FROM employees e
      WHERE e.role_id IN (?)
    `,
      [roleIds]
    );

    // Create a new table
    const table = new Table();

    rows.forEach((employee) => {
      table.cell("First name", employee.first_name);
      table.cell("Last name", employee.last_name);
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

// Function to get roles list from the database
const getRolesList = async () => {
  try {
    const [rows] = await dbConnection.promise().query("SELECT title FROM role");
    return rows;
  } catch (err) {
    console.error("Error fetching departments:", err);
    return [];
  }
};

// Function to get existing and potential managers or employees list from the database
const getListOfManagersOrEmployees = async () => {
  try {
    const [rows] = await dbConnection
      .promise()
      .query(
        "SELECT CONCAT(e.first_name, ' ', e.last_name) AS full_name FROM employees e"
      );

    return rows;
  } catch (err) {
    console.error("Error fetching departments:", err);
    return [];
  }
};

// Function to get existing  managers list from the database
const getListOfExistingManagers = async () => {
  try {
    const [rows] = await dbConnection
      .promise()
      .query(
        "SELECT CONCAT(e.first_name, ' ', e.last_name) AS full_name FROM employees e WHERE e.id IN (SELECT DISTINCT manager_id FROM employees)"
      );

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

// Function to add a employee to the database
const addEmployee = async (employeeData) => {
  try {
    const { firstName, lastName, roleDetails, managerDetails } = employeeData;

    // Make sure roleDetails is a string (role title)
    if (typeof roleDetails !== "string") {
      console.error("Invalid role selection.");
      return;
    }

    // Get the role ID based on the selected role title
    const [roleRows] = await dbConnection
      .promise()
      .query("SELECT id FROM role WHERE title = ?", [roleDetails]);

    if (!roleRows.length) {
      console.error("Role not found.");
      return;
    }

    const roleId = roleRows[0].id;

    // Get the manager ID based on the selected manager full name
    let managerId = null;
    if (managerDetails !== "None") {
      const [managerRows] = await dbConnection
        .promise()
        .query(
          "SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?",
          [managerDetails]
        );

      if (managerRows.length === 0) {
        console.error("Manager not found.");
        return;
      }

      managerId = managerRows[0].id;
    }
    // Insert the new employee into the database
    await dbConnection
      .promise()
      .query(
        "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES  (?, ?, ?, ?)",
        [firstName, lastName, roleId, managerId]
      );
    console.log(`Added ${firstName} ${lastName} to the database`);
  } catch (err) {
    console.error("Error adding employee:", err);
  }
};

// Function to update a employee role in the database
const updateEmployeeRole = async (dataToUpdate) => {
  try {
    const { employeeList, rolesListInfo } = dataToUpdate;
    // Get the employee's ID based on their full name
    const [employeeRows] = await dbConnection
      .promise()
      .query(
        "SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?",
        [employeeList]
      );
    if (employeeRows.length === 0) {
      console.error("Employee not found.");
      return;
    }

    const employeeId = employeeRows[0].id;

    // Get the role ID based on the selected role title
    const [roleRows] = await dbConnection
      .promise()
      .query("SELECT id FROM role WHERE title = ?", [rolesListInfo]);

    if (!roleRows.length) {
      console.error("Role not found.");
      return;
    }

    const roleId = roleRows[0].id;

    // Update the employee's role in the database
    await dbConnection
      .promise()
      .query("UPDATE employees SET role_id = ? WHERE id=?", [
        roleId,
        employeeId,
      ]);
    console.log(`Updated role for ${employeeList} to ${rolesListInfo}`);
  } catch (err) {
    console.error("Error in updating employee role:", err);
  }
};

// Function to update a employee manager in the database
const updateEmployeeManager = async (toUpdateData) => {
  try {
    const { employeeList, managerListInfo } = toUpdateData;
    // Get the employee's ID based on their full name
    const [employeeRows] = await dbConnection
      .promise()
      .query(
        "SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?",
        [employeeList]
      );
    if (employeeRows.length === 0) {
      console.error("Employee not found.");
      return;
    }

    const employeeId = employeeRows[0].id;

    // Get the manager ID based on their full name
    const [managerRows] = await dbConnection
      .promise()
      .query(
        "SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?",
        [managerListInfo]
      );
    if (managerRows.length === 0) {
      console.error("Manager not found.");
      return;
    }

    const managerId = managerRows[0].id;

    // Update the employee's manager in the database
    await dbConnection
      .promise()
      .query("UPDATE employees SET manager_id = ? WHERE id=?", [
        managerId,
        employeeId,
      ]);
    console.log(`Updated manager for ${employeeList} to ${managerListInfo}`);
  } catch (err) {
    console.error("Error in updating employee manager:", err);
  }
};

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  getDepartmentsList,
  getRolesList,
  getListOfManagersOrEmployees,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  getListOfExistingManagers,
};
