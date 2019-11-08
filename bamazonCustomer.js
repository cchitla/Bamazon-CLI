let mysql = require("mysql");
let inquirer = require("inquirer");
let Table = require("cli-table");

let config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
};

let connection = mysql.createConnection(config);

getProductData().then((results) => {
    displayProducts(results);
});


function getProductData() {
    return new Promise(function (resolve, reject) {
        connection.connect((error) => {
            if (error) return reject(error);
            // console.log(`successfully connected on thread ${connection.threadId}`);

            connection.query("SELECT * FROM products", (error, results) => {
                if (error) return reject(error);
                resolve(results);
                connection.end();                
            });
        });
    });
};


function displayProducts(data) {
    console.log(`Welcome, here are the products we have for sale:`);
    let stockArr = [];
    let priceArr = [];

    let displayTable = new Table({
        head: ["Item ID", "Product Name", "Stock", "Price"],
        colWidths: [10, 50, 10, 10]
    });

    for (let i = 0; i < data.length; i++) {
        displayTable.push([data[i].item_id, data[i].product_name, data[i].stock_quantity, data[i].price]);
        stockArr.push(data[i].stock_quantity);
        priceArr.push(data[i].price);
    };

    console.log(displayTable.toString());
    askPurchaseInfo(stockArr, priceArr);  
};


function askPurchaseInfo(stockArr, priceArr) {    
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "Please enter the ID# of the product you want to purchase:"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?"
        },
    ]).then((answers) => {
        let quantity = answers.quantity;
        let itemId = answers.product;
        let newQuantity = stockArr[itemId-1] - quantity;        
        
        if (quantity <= stockArr[itemId-1]) {
            makePurchase(itemId, quantity, priceArr, newQuantity);
        } else {
            console.log("Sorry, we don't have enough current stock to complete your pruchase.");
            askPurchaseInfo(stockArr, priceArr);
        };
    });
};


function makePurchase(itemId, quantity, priceArr, newQuantity) {  
    console.log("Your purchase is being completed...");
    let purchasePrice = quantity * priceArr[itemId-1];

    connection = mysql.createConnection(config);

    connection.connect((error) => {
        if (error) {
            console.log("We're sorry there was an error completing your order. Please try again");
            getProductData().then((results) => {
                displayProducts(results);
            });
        };

        let sqlQuery = "UPDATE products SET ? WHERE ?";
        let query = [ {stock_quantity: newQuantity}, {item_id: itemId} ];

        connection.query(sqlQuery, query, (error, result) => {
            if (error) throw error;
            console.log(`Purchase complete! Your total is: ${purchasePrice}`);
            process.exit();          
        });
    });
};