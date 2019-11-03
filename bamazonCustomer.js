let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

getProductData().then((results) => {
    displayProducts(results);
    //inquirer ask item_id for purchase, then quantity to purchase
    // makePurchase(itemId, quantity)
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
    console.log(`Welcome, here are our products for sale:`);
    let quantityArr = [];
    for (let i = 0; i < data.length; i++) {
        console.log(`
        ID#:${data[i].item_id}. ${data[i].product_name}
        Current Stock: ${data[i].stock_quantity} Price: $${data[i].price}`);
        console.log("");
        quantityArr.push(data[i].stock_quantity);
    };

    askPurchaseInfo(quantityArr);
     
};

function askPurchaseInfo(quantityArr) {
    console.log("ask user what to buy");
    
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
        
        
    })
}

function makePurchase(itemId, quantity) {
    //update quantity in db
    //show user total purchase amount
};
