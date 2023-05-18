//import mysql2
const mysql = require("mysql2");
//import inquirer
const inquirer = require("inquirer");
//import console.table
//const cTable = require('console.table');

require("dotenv").config();

//connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
  afterConnection();
});

//function after connection is established and welcome images shows
afterConnection = () => {
  console.log("***********************************");
  console.log("*                                 *");
  console.log("*        EMPLOYEE MANAGER         *");
  console.log("*                                 *");
  console.log("***********************************");
  promptUser();
};

//inquirer prompt for first action
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View All Employees") {
        showEmployees();
      }
      if (choices === "Add Employee") {
        addEmployee();
      }
      if (choices === "Update Employee Role") {
        updateRole();
      }
      if (choices === "View All Roles") {
        showRoles();
      }
      if (choices === "Add Role") {
        addRole();
      }
      if (choices === "View All Departments") {
        showDepartments();
      }
      if (choices === "Add Department") {
        addDepartment();
      }
      if (choices === "Quit") {
        connection.end();
      }
    });
};

//function to show all employees
showEmployees = () => {
  console.log("Showing all employees.");
  const sql = `SELECT employee.id AS id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id FROM employee JOIN role ON employee.role_id = role.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//function to add an employee
addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "input",
        name: "role_id",
        message: "What is the employee's role id?",
      },
      {
        type: "input",
        name: "manager_id",
        message: "What is the employee's manager id?",
        filter: (input) => {
            if(input == '') {
                return null;
            } else {
                return input;
            }
        }
      },
    ])
    .then((answer) => {
      const { first_name, last_name, role_id, manager_id } = answer;
      const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
      connection.query(
        sql,
        [first_name, last_name, role_id, manager_id],
        (err, result) => {
          if (err) throw err;
          console.log("Added" + answer.first_name + " to employees!");

          promptUser();
        }
      );
    });
};

//function to update employee role
updateRole = () => {
  //get roles from employee table
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      //get employee choice
      .then((empChoice) => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err;

          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Who is the manager of this employee?",
                choices: managers,
              },
            ])
            //get manager choice
            .then((managerChoice) => {
              const manager = managerChoice.manager;
              params.push(manager);

              let employee = params[0];
              params[0] = manager;
              params[1] = employee;

              const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Employee has been updated");

                showEmployees();
              });
            });
        });
      });
  });
};

//function to view all roles
showRoles = () => {
  console.log("Showing all roles.");

  const sql = `SELECT role.id, role.title, department.name AS department FROM role 
    INNER JOIN department ON role.department_id = department.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//function to add role
addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
      },
      {
        type: "input",
        name: "department_id",
        message: "What is the department id of the new role?",
      },
      //  {
      //     type: 'input',
      //     name: 'role',
      //     message: 'What role would you like to add?',
      //     validate: addRole => {
      //         if(addRole) {
      //             return true;
      //         }else {
      //             console.log('Please enter a role.');
      //             return false;
      //         }
      //       }
      //     },
      //     {
      //         type: 'input',
      //         name: 'salary',
      //         message: 'What is the salary of this role?',
      //         validate: addSalary => {
      //             if(isNaN(addSalary)) {
      //                 return true;
      //             } else {
      //                 console.log('Please enter a salary.');
      //                 return false;
      //             }
      //         }
      //     }
    ])
    .then((answer) => {
    //   const params = [answer.role, answer.salary];
    const {title, salary, department_id} = answer
      //grab dept from department table
      const roleSql = "INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?);"

      connection.query(roleSql, [title, salary, department_id], (err, data) => {
        if (err) throw err;

        // const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        // inquirer
        //   .prompt([
        //     {
        //       type: "list",
        //       name: "dept",
        //       message: "What department is this role in?",
        //       choices: dept,
        //     },
        //   ])
        //   .then((deptChoice) => {
        //     const dept = deptChoice.dept;
        //     params.push(dept);

        //     const sql = `INSERT INTO role (title, salary, department_id)
        //                     VALUES (?, ?, ?)`;

            // connection.query(sql, params, (err, result) => {
            //   if (err) throw err;
              console.log("Added" + answer.role + " to roles.");

              promptUser();
            // });
        //   });
      });
    });
};

//function to view all departments
showDepartments = () => {
  console.log("Showing all departments.");
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//function to add department
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department would you like to add?",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name)
                    VALUES (?)`;
      connection.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log("Added" + answer.addDept + " to departments.");

        showDepartments();
      });
    });
};

//function to quit
// quit = () => {

// }
