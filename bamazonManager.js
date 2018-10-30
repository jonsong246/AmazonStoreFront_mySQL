#!/usr/bin.env node

//Dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//Connections to DB
var connection = mysql.createConnection({
    host: "localhost",
    port: 3100,
    user: "root",
    password : "rootroot",
    database: "bamazon_db"
});

//Connection with the SERVER
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    chooseMenu();
});

//Manager choosing from menu list
function chooseMenu() {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "Please select a menu option",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit Manager View"
            ]
        })
        .then(function (answer) {
            switch(answer.menu) {
                case "View Products for Sale":
                    displayItemsForSale();
                    break;

                case "View Low Inventory":
                    displayLowInventory();
                    break;

                case "Add to Inventory":
                    displayItemsForSale(addToInventory);
                    break;

                case "Add new Product":
                    askQuestions();
                    break;

                case "Exit Manager View":
                    exit();
                    break;
            }
        })
}

//Displaying low inventory
function displayItemsForSale(func) {
    connections.query(
        "SELECT item_id, product_name, price, stock_quantity, department_name " + 
        "FROM products " + 
        "WHERE price > 0;", function (err, result){

        if (err) throw err;
        //Building table header
        var obj = result[0];
        var header = [];
        for (var prop in obj) {
            header.push(prop);
        }

        var table = new table({
            head: header,
            colWidths: [15, 10]
        });

        for (var i = 0; i < result.length; i++) {
            table.push([result[i].item_id, result[i].stock_quantity]);
        }
        var output = table.toString();
        console.log(output);
        chooseMenu();
        });
}

//Add to Inventory
function addToInventory(list) {
    inquirer
        .prompt([{
            name: "action",
            type: "list",
            message: "Select item:",
            choices: list
        },
        {
            name: "quantity",
            type: "input",
            message: "Update quantity with:",
        }])
        .then(function (answer) {
            updateQuantity(answer.action, answer.quantity);
        })
}

function updateQuantity(item, quant) {
    var query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?"
    connections.query(
        query,
        [
            quant,
            {
                item_id: item
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("DB has been updated.");
            chooseMenu();
        }
    );
}

function askQuestions() {
    inquirer
        .prompt([{
            name: "id",
            message: "Input Item ID: "
        },
        {
            name: "name",
            message: "Input Product Name: "
        },
        {
            name: "department",
            type: "list",
            message: "Select Department",
            choices: ["Electronics", "Books", "Clothing", "Shoes", "Handmade"]
        },
        {
            name: "price",
            message: "Input Product Cost: "
        },
        {
            name: "stock",
            message: "Input Stock Quantity: "
        }])
        .then(function (answer) {
            //adds new items to DB
            addNewItem(answer.id, answer.name, answer.department, answer.price, answer.stock);
        });
}

//Adds new items to product table 
function addNewItem(id, name, department, price, stock) {
    var query = "INSERT INTO products SET ?"
    connections.query(query,
        {
            item_id: id,
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: stock
        },
        function (err, res) {
            if (err) console.log(err)
            console.log(`New item ${id} is added to the Database.`);
            chooseMenu();
        }
    )
}

function exit() {
    connection.end();
    process.exit(-1);
}