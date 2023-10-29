const inquirer = require("inquirer");

const { app, dbConnection, connectedToDataBase } = require("../app.js");

// Function to handle each action based on the user's choice
const handleAction = async (action) => {
  switch (action) {
    case "View all departments":
      // Handle the view all departments logic
      break;
    case "View all roles":
      // Handle the view all roles logic
      break;
    case "View all employees":
      // Handle the view all employees logic
      break;
    case "Add a department":
      // Handle the add department logic
      break;
    case "Add a role":
      // Handle the add role logic
      break;
    case "Add an employee":
      // Handle the add employee logic
      break;
    case "Update an employee role":
      // Handle the update employee role logic
      break;
    default:
      console.log("Invalid choice. Please choose a valid option.");
  }
};

// Main menu prompts
const mainMenuPrompts = async () => {
  try {
    await connectedToDataBase();
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
  } finally {
    await dbConnection.end();
  }
};

// Start main menu prompts
mainMenuPrompts();
