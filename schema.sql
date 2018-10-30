DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(300) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    stock_quantity INTEGER(10) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Hydroflask (40 oz)", "Hydroflask", 42.95, 5000),
("Iphone XS (64 GB)", "Apple", 999.00, 4000),
("Nintendo Switch", "Nintendo", 299.00, 1000),
("Greenies Dental Treats - Large", "Greenies", 25.00, 10000),
("Tennis Ball (Pack of 60)", "Tourna", 41.00, 500),
("Caffe Espresso (8 oz) - 2 pk", "Lavazza", 13.36, 2000),
("Pomade Firme Hold", "Suavecito", 13.49, 2500),
("Dead Sea Mud Mask", "Pure Body Naturals", 11.20, 1200),
("Clear Jar", "Bormioli Rocco", 11.21, 800),
("Swim Goggles", "Aegend", 12.99, 600);