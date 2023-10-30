const inquirer = require("inquirer");
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
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
      // Handle the add role logic
      break;
    case "Add An Employee":
      // Handle the add employee logic
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
    // await connectedToDataBase();
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

// Start main menu prompts
mainMenuPrompts();
