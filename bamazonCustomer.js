let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
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
    })
}

getProductData().then((results => {
    console.log(results);
}));