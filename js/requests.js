const { dbConnection } = require("../app.js");

// Function to retrieve and display all departments
const viewAllDepartments = async ()=> {
    try{
const [rows] = (await dbConnection).query("SELECT * FROM department")
//display
 console.table("id", "name");
 console.table("__", "___________");
 rows.map(department=> {
    console.table(`${department.id}, ${department.name}`)
 })
    }catch(err) {
       console.error("Error:", err);  
    }
}

module.exports = { viewAllDepartments };