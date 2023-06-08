// Includes packages needed for this application
const inquirer = require("inquirer");
const table = require("console.table");

const connection = require("./config/connection");
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

function run() {
  promptUser();
}
// const updateEmployee = async () => {
//    //Get the list of employees
//   getEmployees().then((employees) => {
//     // Create a choices array for the inquirer prompt
//     const choices = employees.map((employee) => {
//       return { name: employee.first_name + ' ' + employee.last_name, value: employee.id };
//     });  

//   // const sql = `UPDATE role SET role = ? WHERE id = ?`

// }
const updateEmployee = () => {
  // Get the list of employees
  getEmployees().then((employees) => {
    // Create a choices array for the inquirer prompt
    const choices = employees.map((employee) => {
      return { name: employee.first_name + ' ' + employee.last_name, value: employee.id };
    });

    inquirer
      .prompt([
        {
          type: "list",
          message: "Select an employee to update their role:",
          name: "employeeId",
          choices: choices,
        },
        {
          type: "input",
          message: "Enter the new role for the selected employee:",
          name: "newRole",
        },
      ])
      .then((res) => {
        const employeeId = res.employeeId;
        const newRole = res.newRole;
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const params = [newRole, employeeId];

        connection.query(sql, params, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Updated role for employee ${employeeId} to ${newRole}!`);
          promptUser();
        });
      });
  });
};

const getEmployees = () => {
  const sql = `SELECT * FROM employee`;
  let params = {};
  return connection
    .promise()
    .query(sql, params)
    .then((rows, err) => {
      if (err) {
        return;
      }
      return rows[0];
    });
};
const viewEmployees = async () => {
  const employees = await getEmployees();
  console.table(employees);
  promptUser();
};

const getRoles = () => {
  const sql = `SELECT * FROM role`;
  let params = {};
  return connection
    .promise()
    .query(sql, params)
    .then((rows, err) => {
      if (err) {
        return;
      }
      return rows[0];
    });
};

const viewRoles = async () => {
  const roles = await getRoles();
  console.table(roles);
  promptUser();
  
};
const getDepartments = () => {
  const sql = `SELECT * FROM department`;
  let params = {};
  return connection
    .promise()
    .query(sql, params)
    .then((rows, err) => {
      if (err) {
        return;
      }
      return rows[0];
    });
};
const viewDepartments = async () => {
  const departments = await getDepartments();
  console.table(departments);
  promptUser();

};
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "What would you like to call your department?",
      },
    ])
    .then((res) => {
      console.log(res.addDepartment);
      const newDepartment = res.addDepartment;

      const sql = `INSERT INTO department (department_name)
        VALUES (?)`;

      connection.query(sql, newDepartment, (err) => {
        if (err) {
          return;
        }
        console.log(`added ${newDepartment} to departments!`);
        promptUser();
      });
    });
};
const addRole = async () => {

  const departments = await getDepartments();
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Please enter the new role title",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Please enter this role salary",
      },
      {
        type: "list",
        message: "What department would you like to add this role to?",
        name: "departmentRoles",
        choices: departments.map((department) => {
          return { name: department.department_name, value: department.id };
        }),
      },
    ])
    .then((res) => {
      console.log({ res });
      const newRole = res.roleTitle;
      const roleSalary = res.roleSalary;
      const departmentRoles = res.departmentRoles;
      const sql = `INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?)`;

      connection.query(sql, [newRole, roleSalary, departmentRoles], (err) => {
        if (err) {
          return;
        }
        console.log(
          `added ${newRole}, ${roleSalary} and ${departmentRoles} to role!`
        );
        promptUser();
      });
    });
};
const addEmployee = async () => {
  const employees = await getEmployees();
  const departments = await getDepartments();
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter thier First Name",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter their Last Name",
      },
      {
        type: "list",
        message: "What is this emploees role?",
        name: "departmentRoles",
        choices: departments.map((department) => {
          return { name: department.department_name, value: department.id };
        }),
      },
      {
        type: "list",
        message: "Who is this employees manager?",
        name: "employeeManager",
        choices: employees.map((employee) => {
          return { name: employee.first_name + ' ' + employee.last_name, value: employee.id };
        }),
      },
    ])
    .then((res) => {
      console.log({ res });
      const newFname = res.firstName;
      const newLname = res.lastName;
      const departmentRoles = res.departmentRoles;
      const employeeManager = res.employeeManager;
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES (?, ?, ?, ?)`;

      connection.query(sql, [newFname, newLname, departmentRoles, employeeManager], (err) => {
        if (err) {
          return;
        }
        console.log(
          `Added ${newFname} ${newLname}. Their new role is ${departmentRoles} and their manager is ${employeeManager}!`
        );
        promptUser();
      });
    });
};
function promptUser() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "todo",
        choices: [
          "View all Employees",
          "Add an Employee",
          "Update an Employee Role",
          "View all Roles",
          "Add a role",
          "View all Departments",
          "Add a department",
          "Quit",
        ],
      },
    ])

    .then((answers) => {
      console.log(answers);
      const userChoice = answers.todo;

      if (userChoice === "View all Employees") {
        viewEmployees();
      } else if (userChoice === "View all Roles") {
        viewRoles();
      } else if (userChoice === "View all Departments") {
        viewDepartments();
      } else if (userChoice === "Add a department") {
        addDepartment();
      } else if (userChoice === "Add a role") {
        addRole();
      } else if (userChoice === "Add an Employee") {
        addEmployee();
      } else if (userChoice === "Update an Employee Role") {
        updateEmployee();
      } else if (userChoice === "Quit") {
        console.log("Goodbye!");
        return; // Exit the recursive loop
      }
    })

    .catch((err) => console.error(err));
}

run();

// app.put('/api/review/:id', (req, res) => {
//   const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
//   const params = [req.body.review, req.params.id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: 'Movie not found'
//       });
//     } else {
//       res.json({
//         message: 'success',
//         data: req.body,
//         changes: result.affectedRows
//       });
//     }
//   });
// });