#!/usr/bin.env node

//Dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var table = require('cli-table');

//SQL Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "bamazon_db"
});

//Connecting with the Server
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    saleItems();
});

//Returning all items available for sale
function saleItems() {
    connection.query("SELECT item_id, product_name, price, department_name FROM products WHERE price > 0;", function (err, result){
        //Table header
        var obj = result[0];
        var header = [];
        for (var prop in obj) {
            header.push(prop);
        }

        var table = new table({
            head: header,
            colWidths: [20, 55, 10, 20]
        });

        //Sets data within the table
        var item_ids = [];
        for (var i = 0; i < result.length; i++) {
            item_ids.push(result[i].item_id);
            table.push([result[i].item_id, wrap(result[i].product_name), result[i].price.toFixed(2), result[i].department_name]);
        }
        var output = table.toString();
        console.log(output);
            buyItem(items_ids);
    });
}

//Buying Items function

function buyItem(list) {
    inquirer
        .prompt([{
            name: "buy",
            type: "list",
            message: "How much of this item would you like to purchase?",
            choices: list
        },
        {
            name: "quantity",
            type: "input",
            message: "Please enter amount"
        }])
        .then(function (answer) {
            //The user-picked item
            var query = "SELECT item_id, stock_quantity, price FROM products WHERE ?";
            connection.query(query, { item_id: answer.buy }, function (err, res) {
                var inputQuantity = answer.quantity;
                checkStock(res[0].stock_quantity, inputQuantity, res[0].price.toFixed(2), res[0].item_id);
            });
        })
}

//Checking the quantity of stock
function checkStock(on_stock, buy_quantity, price, item_id) {
    if (on_stock >= buy_quantity) {
        var total_price = buy_quantity * price;
        console.log(`Your total amount is ${total_price}.\nThank you for your purchase.`);
        //Updating DB
        updateStock(buy_quantity, item_id);
    } else {
        console.log(`Insufficient amount in stock. \nThere are only ${on_stock} items remaining in stock`);
        connection.end();
    }
}

//Updating the stock quantity in DB
function updateStock(quantity, item_id) {
    var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?";
    connection.query(
        query,
        [
            quantity,
            {
                item_id: item_id
            }
        ],
        function (error) {
            if (error) throw error;
            console.log("DB was succesfully updated.");
            connection.end();
        });
}