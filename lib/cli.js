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
          console.table(rows);
        });
      }
      else if (userChoice === 'View all Roles'){
        
        const sql = `SELECT * FROM role`;
        let params = {};
        connection.query(sql, params,(err, rows) => {
          if (err) {
             return;
          }
          console.table(rows);
        });
      }
      else if (userChoice === 'View all Departments'){
        
        const sql = `SELECT * FROM department`;
        let params = {};
        connection.query(sql, params,(err, rows) => {
          if (err) {
             return;
          }
          console.table(rows);
        });
      }
      else if (userChoice === 'Quit') {
        console.log('Goodbye!');
        return; // Exit the recursive loop
      }
      this.promptUser();
    })
   
    // .then(() => console.log('Done!'))
      .catch((err) => console.error(err));
  }
}
module.exports = CLI;

