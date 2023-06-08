// Includes packages needed for this application
const inquirer = require('inquirer');
// const { writeFile } = require('fs/promises');
// const { join } = require('path');
// const { generateLogo } = require('./shapes');
const sequelize = require("../config/connection");


// An array of questions for user input
class CLI {
  constructor() {
    this.todo = '';
   
  }
    run(){
      return inquirer
      .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'todo',
        choices: ['View all Employees', 'Add an Employee', 'Update an Employee Role', 'View all Roles', 'Add a role', 'View all departments', 'Add a department', 'Quit'],
      },
    ])

    .then((answers) => {
      console.log (answers);
      const userChoice = answers.todo;
      if (userChoice === 'View all Employees'){
        console.log('inside function')
        
        const sql = `SELECT * FROM employee`;
        console.log(sql);
        sequelize.query(sql, (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
             return;
          }
          res.json({
            message: 'success',
            data: rows
          });
          console.log(rows);
        });
    }
    })
   
    .then(() => console.log('Done!'))
      .catch((err) => console.error(err));
  }
}
module.exports = CLI;

