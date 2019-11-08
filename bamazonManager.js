let mysql = require("mysql");
let inquirer = require("inquirer");
let Table = require("cli-table");

const config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
};

let connection = mysql.createConnection(config);

runManager();


function runManager() {
    let choiceArray = ["View products", "View Low Inventory", "Update Stock", "Add New Product", "Exit"];

    inquirer.prompt([{
        name: "action",
        message: "What would you like to do?",
        type: "list",
        choices: choiceArray
    }]).then((answers) => {
        switch (answers.action) {
            case choiceArray[0]:
                displayProducts();
                break;
            case choiceArray[1]:
                viewLowStock();
                break;
            case choiceArray[2]:
                updateStock();
                break;
            case choiceArray[3]:
                askNewProduct();
                break;
            case choiceArray[4]:
                process.exit();
                break;
        };
    });
};


function displayProducts() {
    connection = mysql.createConnection(config);

    connection.connect((error) => {
        if (error) throw error;

        connection.query("SELECT * FROM products", (error, results) => {
            if (error) return reject(error);
            let displayTable = new Table ({
                head: ["Item ID", "Product Name", "Stock", "Price"],
            colWidths: [10, 50, 10, 10]
            });

            for (let i = 0; i < results.length; i++) {
                displayTable.push([results[i].item_id, results[i].product_name, results[i].stock_quantity, results[i].price]);
            };

            console.log(displayTable.toString());
            connection.end();
            runManager();
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
        runManager();
    });
};

function viewLowStock() {
    connection = mysql.createConnection(config);
    connection.query("SELECT * FROM products", (error, results) => {
        if (error) throw error;
        let displayTable = new Table ({
            head: ["Item ID", "Product Name", "Stock", "Price"],
        colWidths: [10, 50, 10, 10]
        });

        for (let i = 0; i < results.length; i++) {
            if (results[i].stock_quantity <= 5) {
            displayTable.push([results[i].item_id, results[i].product_name, results[i].stock_quantity, results[i].price]);
            }
        };

        console.log(displayTable.toString());
        connection.end();
        runManager();
    })
    //
};

function askNewProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter the name of the product:"
        },
        {
            name: "department",
            type: "input",
            message: "Enter the department:"
        },
        {
            name: "price",
            type: "input",
            message: "Enter the price for the product:"
        },
        {
            name: "stock",
            type: "input",
            message: "Enter the stock quantity:"
        }
    ]).then((answers) => {
        let newProduct = {
            product_name: answers.name,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.stock
        };
        createNewProduct(newProduct)
    });
};

function createNewProduct(newProduct) {
    let sqlQuery = "INSERT INTO products SET ?";
    let query = newProduct;
    connection = mysql.createConnection(config);
    connection.query(sqlQuery, query, (error, results) => {
        if (error) throw error;
        console.log(results);
        connection.end();
        runManager();
    });
};

function updateDb(itemId, newQuantity) {
    connection = mysql.createConnection(config);

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
