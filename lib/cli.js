// Includes packages needed for this application
const inquirer = require('inquirer');
// const { writeFile } = require('fs/promises');
// const { join } = require('path');
// const { generateLogo } = require('./shapes');



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
    })
   
    .then(() => console.log('Done!'))
      .catch((err) => console.error(err));
  }
}
module.exports = CLI;

// // Store the returned SVG string from generateLogo in a variable
      // const svgLogo = generateLogo(answers);
      
      // //uses path to write the file into examples folder
      // return writeFile(
      //   join(__dirname, '..', 'examples', 'logo.svg'),
      //   svgLogo
      // );
       //console logs generated logo on function completion