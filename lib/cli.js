// // Includes packages needed for this application
// const inquirer = require("inquirer");
// const table = require("console.table");

// const connection = require("../config/connection");
// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// function run() {
//   promptUser();
// }
// const viewEmployees = () => {
//   const sql = `SELECT * FROM employee`;
//   let params = {};
//   connection.query(sql, params, (err, rows) => {
//     if (err) {
//       return;
//     }
//     console.log(); //adds a new line before the table
//     console.table(rows);
//     promptUser();
//   });
// };
// const viewRoles = () => {
//   const sql = `SELECT * FROM role`;
//   let params = {};
//   connection.query(sql, params, (err, rows) => {
//     if (err) {
//       return;
//     }
//     console.log(); //adds a new line before the table
//     console.table(rows);
//     promptUser();
//   });
// };
// const getDepartments = () => {
//   const sql = `SELECT * FROM department`;
//   let params = {};
//   return connection
//     .promise()
//     .query(sql, params)
//     .then((rows, err) => {
//       if (err) {
//         return;
//       }
//       return rows[0];
//     });
// };
// const viewDepartments = async () => {
//   const departments = await getDepartments();
//   console.table(departments);
//   promptUser();

//   // const sql = `SELECT * FROM department`;
//   // let params = {};
//   // connection.query(sql, params, (err, rows) => {
//   //   if (err) {
//   //     return;
//   //   }
//   //   console.log(); //adds a new line before the table
//   //   console.table(rows);
//   //   promptUser();
//   // });
// };
// const addDepartment = () => {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "addDepartment",
//         message: "What would you like to call your department?",
//       },
//     ])
//     .then((res) => {
//       console.log(res.addDepartment);
//       const newDepartment = res.addDepartment;

//       const sql = `INSERT INTO department (department_name)
//         VALUES (?)`;

//       connection.query(sql, newDepartment, (err) => {
//         if (err) {
//           return;
//         }
//         console.log(`added ${newDepartment} to departments!`);
//         promptUser();
//       });
//     });
// };
// const addRole = async () => {
//   // connection.query(`SELECT * FROM department`, {}, (err, departments) => {
//   //   if (err) {
//   //     return;
//   //   }
//   //   console.log(departments); //shows all rows
//   const departments = await getDepartments();
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "roleTitle",
//         message: "Please enter the new role title",
//       },
//       {
//         type: "input",
//         name: "roleSalary",
//         message: "Please enter this role salary",
//       },
//       {
//         type: "list",
//         message: "What department would you like to add this role to?",
//         name: "departmentRoles",
//         choices: departments.map((department) => {
//           return { name: department.department_name, value: department.id };
//         }),
//       },
//     ])
//     .then((res) => {
//       console.log({ res });
//       const newRole = res.roleTitle;
//       const roleSalary = res.roleSalary;
//       const departmentRoles = res.departmentRoles;
//       const sql = `INSERT INTO role (title, salary, department_id)
//           VALUES (?, ?, ?)`;

//       connection.query(sql, [newRole, roleSalary, departmentRoles], (err) => {
//         if (err) {
//           return;
//         }
//         console.log(
//           `added ${newRole}, ${roleSalary} and ${departmentRoles} to role!`
//         );
//         promptUser();
//       });
//     });
//   // });
// };
// function promptUser() {
//   inquirer
//     .prompt([
//       {
//         type: "list",
//         message: "What would you like to do?",
//         name: "todo",
//         choices: [
//           "View all Employees",
//           "Add an Employee",
//           "Update an Employee Role",
//           "View all Roles",
//           "Add a role",
//           "View all Departments",
//           "Add a department",
//           "Quit",
//         ],
//       },
//     ])

//     .then((answers) => {
//       console.log(answers);
//       const userChoice = answers.todo;

//       if (userChoice === "View all Employees") {
//         viewEmployees();
//       } else if (userChoice === "View all Roles") {
//         viewRoles();
//       } else if (userChoice === "View all Departments") {
//         viewDepartments();
//       } else if (userChoice === "Add a department") {
//         addDepartment();
//       } else if (userChoice === "Add a role") {
//         addRole();
//       } else if (userChoice === "Quit") {
//         console.log("Goodbye!");
//         return; // Exit the recursive loop
//       }
//     })

//     .catch((err) => console.error(err));
// }

// module.exports = run;
