var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function(err){
    if (err) throw err;
    start();
});

function start(){
    inquirer
    .prompt({
        name: "yesOrNo",
        type: "list",
        message: "Would you like to buy fruits today?",
        choices: ["Yes!", "No!"]
    })
    .then(function(answer){
        if (answer.yesOrNo === "Yes!"){
            fruitYes();
        }
        else if(answer.yesOrNo === "No!"){
            return connection.end();
        }
    })
}

function fruitYes() {

    connection.query(
        "SELECT * FROM products",
        function(err, res){
            if (err) throw err;
            console.table(res);
            inquirer
            .prompt([
                {
                    name: "item",
                    type: "input",
                    message: "What is the name of the item you would like to buy?"
                },
                {
                    name: "category",
                    type: "number",
                    message:"How many would you like?",
                }
            ])
            .then(function(answer){
                makePurchase(answer);
            })
            
        }
    )
}

function makePurchase(answer){
    connection.query(
        "SELECT product_name, price, stock_quantity FROM products WHERE product_name ='" + answer.item + "'",
        function(err, res){
            if (err) throw err;
            console.log(res);

            if (answer.category > res[0].stock_quantity){
             console.log("Insufficient quantity!"); 
             return
            }
            var cost = answer.category * res[0].price;
            console.log(cost);
        }  
        .then(function(updateTable){
            restock(updateTable);
        })
        
    )
}

function restock(updateTable){
    connection.query(
        "UPDATE products",
        function(err, res){
        if (err) throw err;
        console.log(res);
        }
    )
}