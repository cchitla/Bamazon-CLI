let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

function displayProducts() {
    connection.connect((error) => {
        if (error) throw error;
        console.log(`successfully connected on thread ${connection.threadId}`);
        
        connection.query("SELECT * FROM products", (error, results) => {
            if (error) throw error;
            console.log(results);
            connection.end();
        });
    });
};

displayProducts();