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
        choices: ["View products", "View Low Inventory", "Update Stock", "Add New Product", "Exit"]
    }]).then((answers) => {
        if (answers.action === "View products") {
            displayProducts();
        } else if (answers.action === "View Low Inventory") {
            viewLowStock();
        } else if (answers.action === "Update Stock") {
            updateStock();
        } else if (answers.action === "Add New Product") {
            addNewProduct()
        } else if (answers.action === "Exit") {
            process.exit();
        };
    });
};


function displayProducts() {
    connection.connect((error) => {
        if (error) throw error;

        connection.query("SELECT * FROM products", (error, results) => {
            if (error) return reject(error);
            for (let i = 0; i < results.length; i++) {
// leave this ugly indentation alone :(
                console.log(`ID#:${results[i].item_id}. ${results[i].product_name}
Current Stock: ${results[i].stock_quantity} Price: $${results[i].price}`);
                console.log("");
            };
            connection.end();
        });
    });
};

function updateStock() {
    inquirer.prompt([
        {
            name: "itemId",
            type: "input",
            message: "Enter the item number of the product you want to update",
        }
        , {
            name: "quantity",
            type: "input",
            message: "Enter the new amount of stock",
        }
    ]).then((answers) => {
        let itemId = answers.itemId;
        let newQuantity = answers.quantity
        updateDb(itemId, newQuantity);
    });

};

function viewLowStock() {
    connection = mysql.createConnection(config);
    connection.query("SELECT * FROM products", (error, results) => {
        if (error) throw error;
        for (let i = 0; i < results.length; i++) {
            if (results[i].stock_quantity <= 5) {
    // leave this ugly indentation alone :(
                console.log(`ID#:${results[i].item_id}. ${results[i].product_name}
    Current Stock: ${results[i].stock_quantity} Price: $${results[i].price}`);
                console.log("");
            };
        };
        connection.end();
        runManager();
    })
    //
};

function addNewProduct() {
    console.log("add new");
    //inquirer product_name
    //inquirer department_name
    //inquirer price
    //inquirer stock_quantity

};

function updateDb(itemId, newQuantity) {
    let connection = mysql.createConnection(config);

    connection.connect((error) => {
        if (error) throw error;
        let sqlQuery = "UPDATE products SET ? WHERE ?";
        let query = [{ stock_quantity: newQuantity }, { item_id: itemId }];

        connection.query(sqlQuery, query, (error, results) => {
            if (error) throw error;
            console.log("Stock updated successfully.");
            connection.end();
            runManager();

        });
    });
};
