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

    inquirer.prompt([{
        name: "action",
        message: "What would you like to do?",
        type: "list",
        choices: ["View products", "Update Stock", "Add New Product"]
    }]).then((answers) => {
        console.log(answers);
        if (answers.action === "View products") {
            displayProducts();
        } else if (answers.action === "Update Stock") {
            updateStock();
        } else if (answers.action === "Add New Product") {
            addNewProduct()
        }

    })
};


function displayProducts() {
    connection.connect((error) => {
        if (error) throw error;
        console.log(`successfully connected on thread ${connection.threadId}`);

        connection.query("SELECT * FROM products", (error, results) => {
            if (error) return reject(error);
            for (let i = 0; i < results.length; i++) {
                console.log(`ID#:${results[i].item_id}. ${results[i].product_name}
Current Stock: ${results[i].stock_quantity} Price: $${results[i].price}`);
                console.log("");
            };
            connection.end();
        });
    });
};

function updateStock() {

};

function addNewProduct() {

};