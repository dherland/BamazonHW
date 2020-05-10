var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
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
                    name: "product",
                    type: "input",
                    message: "What is the id of the item you would like to buy?"
                },
                {
                    name: "quantity",
                    type: "number",
                    message:"How many would you like?",
                }
            ])
            .then(function(answer){
                var quantity = answer.quantity;
                makePurchase(answer);
            })
            
        }
    )
}

function makePurchase(answer, item){
    connection.query(
        "SELECT product_name, price, stock_quantity FROM products WHERE product_name ='" + answer.product + "'",
        function(err, res){
            if (err) throw err;
            console.log(res);
            if (answer.product > res[0].stock_quantity){
             console.log("Insufficient quantity!"); 
             return
            }
            else {
            var cost = answer.quantity * res[0].price;
            var newAmount = res[0].stock_quantity - answer.quantity;
            console.log(cost);
            console.log("That will be $ " + cost);
            console.log(newAmount);
            var item = answer.id;
            console.log(item);   
            // var item = answer.product;
            restock();
            }
        },
    )
}
function restock(answer, newAmount, item){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: newAmount
        },
        {
            id: item 
        }
    ],
        function(err, res){
        if (err) throw err;
        console.log(res.affectedRows + "products restocked!")
        console.table(res);
        fruitYes();
        }
    )
}