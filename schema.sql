DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100),
department_name VARCHAR(100),
price DECIMAL (6, 2),
stock_quantity INT DEFAULT 0 NOT NULL,
PRIMARY KEY (item_id)
);