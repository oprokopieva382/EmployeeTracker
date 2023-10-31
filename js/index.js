const inquirer = require("inquirer");
const figlet = require("figlet");
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  getDepartmentsList,
  getRolesList,
  getManagersList,
  addEmployee,
} = require("./requests.js");

// Function to handle each action based on the user's choice
const handleAction = async (action) => {
  switch (action) {
    case "View All Departments":
      await viewAllDepartments();
      mainMenuPrompts();
      break;
    case "View All Roles":
      await viewAllRoles();
      mainMenuPrompts();
      break;
    case "View All Employees":
      await viewAllEmployees();
      mainMenuPrompts();
      break;
    case "Add A Department":
      const name = await promptUserForDepartmentName();
      await addDepartment(name);
      mainMenuPrompts();
      break;
    case "Add A Role":
      const info = await promptUserForRoleInfo();
      await addRole(info);
      mainMenuPrompts();
      break;
    case "Add An Employee":
      const employeeData = await promptUserForEmployeeInfo();
      await addEmployee(employeeData);
      mainMenuPrompts();
      break;
    case "Update An Employee Role":
      // Handle the update employee role logic
      break;
    default:
      console.log("Invalid choice. Please choose a valid option.");
  }
};

// Main menu prompts
const mainMenuPrompts = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "menuChoiceToPick",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add An Employee",
          "Update An Employee Role",
          "View All Roles",
          "Add A Role",
          "View All Departments",
          "Add A Department",
        ],
      },
    ]);

    await handleAction(answers.menuChoiceToPick);
  } catch (err) {
    console.error("Error:", err);
  }
};

// Prompt the user for the department name
const promptUserForDepartmentName = async () => {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the department?",
    },
  ]);
  return answer.departmentName;
};

// Prompt the user to add role details
const promptUserForRoleInfo = async () => {
  const departmentsList = await getDepartmentsList();
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "roleTitle",
      message: "What is the name of the role?",
    },
    {
      type: "number",
      name: "roleSalary",
      message: "What is the salary for the role?",
    },
    {
      type: "list",
      name: "departmentName",
      message: "Which department does the role belong to?",
      choices: departmentsList.map((department) => department.name),
    },
  ]);
  return answers;
};

// Prompt the user to add employee details
const promptUserForEmployeeInfo = async () => {
  const rolesList = await getRolesList();
  const managersList = await getManagersList();

  const roleTitles = rolesList.map((role) => role.title);
  // Add "None" as the first option for the manager
  const managerChoices = [
    "None",
    ...managersList.map((manager) => manager.full_name),
  ];

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "roleDetails",
      message: "What is the employee's role?",
      choices: roleTitles,
    },
    {
      type: "list",
      name: "managerDetails",
      message: "Who is the employee's manager?",
      choices: managerChoices,
    },
  ]);
  return answers;
};

// Function for text art
const projectNameDisplay = () => {
  const projectText = "Employee\n\nManager";
  figlet.text(
    projectText,
    {
      font: "Standard",
    },
    (err, data) => {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
      mainMenuPrompts();
    }
  );
};

// Start main menu prompts
projectNameDisplay();
