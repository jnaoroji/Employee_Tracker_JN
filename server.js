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
const updateEmployee = () => {
  // Get the list of employees
  getEmployees().then((employees) => {
    // Create a choices array for the inquirer prompt
    const choicesEmployee = employees.map((employee) => {
      return { name: employee.first_name + ' ' + employee.last_name, value: employee.id };
    });

    // Get the list of roles
    getRoles().then((roles) => {
      // Create a choices array for the roles
      const choicesRole = roles.map((role) => {
        return { name: role.title, value: role.id };
      });
    
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select an employee to update their role:",
          name: "employeeId",
          choices: choicesEmployee,
        },
        {
          type: "list",
          message: "Assign a role for this employee:",
          name: "newRole",
          choices: choicesRole,
        },
      ])
      .then((res) => {
        const employeeId = res.employeeId;
        const newRole = res.newRole;
        const selectedRole = roles.find((role) => role.id === newRole);
        const newRoleTitle = selectedRole.title;
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const params = [newRole, employeeId];

        connection.query(sql, params, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          const selectedEmployee = employees.find((employee) => employee.id === employeeId);
          const employeeFirstName = selectedEmployee.first_name;
          console.log(`Updated role for employee ${employeeFirstName} to ${newRoleTitle}!`);
          promptUser();
        });
      });
  })
});
}
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
  const roles = await getRoles();
  const departments = await getDepartments();

  // Map role IDs to role titles
  const roleMap = roles.reduce((map, role) => {
    map[role.id] = role.title;
    return map;
  }, {});

  // Map department IDs to department names
  const departmentMap = departments.reduce((map, department) => {
    map[department.id] = department.department_name;
    return map;
  }, {});
  // Create a map of employee IDs to manager names
  const managerMap = employees.reduce((map, employee) => {
    const manager = employees.find((e) => e.id === employee.manager_id);
    if (manager) {
      map[employee.id] = `${manager.first_name} ${manager.last_name}`;
    } else {
      map[employee.id] = 'null';
    }
    return map;
  }, {});

  // Replace role_id and department_id with corresponding titles/names in employees data
  const employeesWithDetails = employees.map((employee) => {
    return {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      title: roleMap[employee.role_id],
      salary: roles.find((role) => role.id === employee.role_id).salary,
      department_name: departmentMap[roles.find((role) => role.id === employee.role_id).department_id],
      manager: managerMap[employee.id],
    };
  });

  console.table(employeesWithDetails);
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
  const departments = await getDepartments();

  // Map department IDs to department names
  const departmentMap = departments.reduce((map, department) => {
    map[department.id] = department.department_name;
    return map;
  }, {});

  // Replace department_id with department_name in roles data
  const rolesWithDepartmentNames = roles.map((role) => {
    return {
      id: role.id,
      title: role.title,
      salary: role.salary,
      department: departmentMap[role.department_id],
    };
  });

  console.table(rolesWithDepartmentNames);
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
        message: "What is the name of the department?",
      },
    ])
    .then((res) => {
      // console.log(res.addDepartment);
      const newDepartment = res.addDepartment;

      const sql = `INSERT INTO department (department_name)
        VALUES (?)`;

      connection.query(sql, newDepartment, (err) => {
        if (err) {
          return;
        }
        console.log(`Added ${newDepartment} to departments!`);
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

      const newRole = res.roleTitle;
      const roleSalary = res.roleSalary;
      const departmentRoles = res.departmentRoles;
      const selectedDepartment = departments.find(
        (department) => department.id === departmentRoles
      );
      const departmentName = selectedDepartment.department_name;
      const sql = `INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?)`;

      connection.query(sql, [newRole, roleSalary, departmentRoles], (err) => {
        if (err) {
          return;
        }
        console.log(
          `Added new role of ${newRole}, with a salary of ${roleSalary} into ${departmentName} department!`
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
        message: "What is this employees role?",
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

      const newFname = res.firstName;
      const newLname = res.lastName;
      const departmentRoles = res.departmentRoles;
      const selectedDepartment = departments.find(
        (department) => department.id === departmentRoles
      );
      const departmentName = selectedDepartment.department_name;
      const employeeManager = res.employeeManager;
      const selectedManager = employees.find(
        (employee) => employee.id === employeeManager
      );
      const managerName = selectedManager.first_name + ' ' + selectedManager.last_name;

      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES (?, ?, ?, ?)`;

      connection.query(sql, [newFname, newLname, departmentRoles, employeeManager], (err) => {
        if (err) {
          return;
        }
        console.log(
          `Added ${newFname} ${newLname} to database! Their new role is ${departmentName} and their manager is ${managerName}.`
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