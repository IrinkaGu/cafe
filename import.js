"use strict";

const config = require("./server/config");
const db = require("./server/db");
const port = process.env.PORT || config.server.defaultPort;

db.connect();

var data = require("./menu");
var Dish = require("./server/models/dish");

console.log('START');
for(var x = 0; x <= data.length - 1; x++){
    new Dish({
        title: data[x].title,
        image: data[x].image,
        rating: data[x].rating,
        ingredients: data[x].ingredients,
        price: data[x].price
    })
    .save(function(err){
        if (err) console.log(err);
        console.log('SUCCESS');
    });
}
db.disconnect();
console.log('END');