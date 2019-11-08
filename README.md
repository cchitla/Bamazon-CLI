# Bamazon

This program runs a simulated store front. There is a customer facing program to make purchases, and a manger program to update stock and add new products.

# Install

```sh
$ npm install mysql
$ npm install inquirer
$ npm install cli-table
```

# Customer

```sh
$ npm bamazonCustomer
```
The customer program displays all products, with their price and quantity in stock. The customer may then enter the product ID# they want to purchase and then the quantity. If there is not enough inventory, the user is told and asked again. Otherwise, the purchase updates the database and informs the user the total purchase price.

![](/readme-data/customer.gif)


# Manager
```sh
$ npm bamazonManager
```
The manager program asks what the user wants to do: view all products, view low stock (5 or less), update stock, add a new product, or exit the program. 

![](/readme-data/manager.gif)