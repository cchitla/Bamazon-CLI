let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

// getProductDate > displayProducts > askPurchaseInfo > makePurchase
getProductData().then((results) => {
    displayProducts(results);
});

function getProductData() {
    return new Promise(function (resolve, reject) {
        connection.connect((error) => {
            if (error) return reject(error);
            console.log(`successfully connected on thread ${connection.threadId}`);

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
    for (let i = 0; i < data.length; i++) {
        console.log(`
        ID#:${data[i].item_id}. ${data[i].product_name}
        Current Stock: ${data[i].stock_quantity} Price: $${data[i].price}`);
        console.log("");
        stockArr.push(data[i].stock_quantity);
        priceArr.push(data[i].price);
    };
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
        quantity = answers.quantity;
        itemId = answers.product;

        if (quantity < stockArr[itemId-1]) {
            makePurchase(itemId, quantity, priceArr);
        } else {
            console.log("Sorry, we don't have enough current stock to complete your pruchase.");
            askPurchaseInfo(stockArr, priceArr);
        };
        
    });
};


let arr = [7, 5, 3, 2, 4, 5, 10, 8, 9, 6]

function makePurchase(itemId, quantity, priceArr) {  
    console.log("makePruchase function");
    
    //update quantity in db
    //show user total purchase amount
};
