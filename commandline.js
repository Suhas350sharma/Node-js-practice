#!/usr/bin/env node

const { program } = require('commander');


// Set up the CLI tool
program
  .name('greet')
  .description('A CLI tool to greet the user and display the current date and time')
  .version('1.0.0');

// Define the main command
program
  .argument('[name]', 'Your name')
  .option('-d, --date', 'Display only the current date')
  .action((name, options) => {
    const currentDate = new Date().toLocaleString();
   

    if (name) {
      console.log(`Hello, ${name}!`); 
      console.log('Hello, there!');
    }

    if (options.date) {
      console.log(`Today's date: ${new Date().toLocaleDateString()}`);
    } else {
      console.log(`Today is: ${currentDate}`);
    }
  
  });


program.parse();
