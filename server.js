const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
// const mysql = require('mysql2');
// const routes = require('./routes');
const sequelize = require('./config/connection');
const CLI = require('./lib/cli');

const app = express();
const PORT = process.env.PORT || 3001;
// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
// app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});


const cli = new CLI();

cli.run();