// Includes packages needed for this application
const inquirer = require('inquirer');
const table = require('console.table');

const connection = require("../config/connection");
connection.connect(function(err){
  if (err) throw err;
  console.log('Connected!');
})

// An array of questions for user input
class CLI {
  constructor() {
    this.todo = '';
   
  }
    run(){
      this.promptUser();
    }
      
    promptUser(){
    inquirer
      .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'todo',
        choices: ['View all Employees', 'Add an Employee', 'Update an Employee Role', 'View all Roles', 'Add a role', 'View all Departments', 'Add a department', 'Quit'],
      },
    ])

    .then((answers) => {
      console.log (answers);
      const userChoice = answers.todo;
      
      if (userChoice === 'View all Employees'){
        
        const sql = `SELECT * FROM employee`;
        let params = {};
        connection.query(sql, params,(err, rows) => {
          if (err) {
             return;
          }
          console.log();//adds a new line before the table
          console.table(rows);
          this.promptUser();
        });
      }

      else if (userChoice === 'View all Roles'){
        
        const sql = `SELECT * FROM role`;
        let params = {};
        connection.query(sql, params,(err, rows) => {
          if (err) {
             return;
          }
          console.log();//adds a new line before the table
          console.table(rows);
          this.promptUser();
        });
      }

      else if (userChoice === 'View all Departments'){
        
        const sql = `SELECT * FROM department`;
        let params = {};
        connection.query(sql, params,(err, rows) => {
          if (err) {
             return;
          }
          console.log();//adds a new line before the table
          console.table(rows);
          this.promptUser();
        });
      }

      else if (userChoice === 'Add a department'){
        
        inquirer.prompt([
          {
            type: 'input',
            name: 'addDepartment',
            message: 'What would you like to call your department?',
          },
        ])
        .then((res) => {
          console.log(res.addDepartment);
          const newDepartment = res.addDepartment;

          const sql = `INSERT INTO department (department_name)
          VALUES (?)`;
          
          connection.query(sql, newDepartment,(err) => {
            if (err) {
               return;
            }
            console.log(`added ${newDepartment} to departments!`)
            this.promptUser();
          })
        });    
      }    
      else if (userChoice === 'Add a role'){
        
        inquirer.prompt([
          {
            type: 'input',
            name: 'roleTitle',
            message: 'Please enter the new role title',
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'Please enter this role salary',
          },
          {
            type: 'list',
            message: 'What department would you like to add this role to?',
            name: 'departmentRoles',
            choices: ['Legal', 'Sales'],
          },
        ])
        .then((res) => {
          console.log({res});
          const newRole = res.roleTitle;
          const roleSalary = res.roleSalary;
          
          const sql = `INSERT INTO role (title, salary)
          VALUES (?)`;
          
          connection.query(sql, newRole, roleSalary,(err) => {
            if (err) {
               return;
            }
            console.log(`added ${newRole} and ${roleSalary} to role!`)
            this.promptUser();
          })
        });    
      }    
      else if (userChoice === 'Quit') {
        console.log('Goodbye!');
        return; // Exit the recursive loop
      }
     
    })
   
    // .then(() => console.log('Done!'))
      .catch((err) => console.error(err));
  }
}
module.exports = CLI;

