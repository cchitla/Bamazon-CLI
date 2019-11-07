let mysql = require("mysql");
let inquirer = require("inquirer");

let config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
};

let connection = mysql.createConnection(config);

runManager();

function runManager() {
    connection.connect((error) => {
        if (error) throw error;
        console.log(`successfully connected on thread ${connection.threadId}`);

        connection.query("SELECT * FROM products", (error, results) => {
            if (error) return reject(error);
            // nextFunction(results)
            connection.end();                
        });
    });
};