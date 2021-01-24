//jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

let items =[];

const app = new express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res)=>{
    let day = date();
    res.render("list", {day: day, newListItems :items});
});


app.post('/', (req, res)=>{
    items.push(req.body.newItem);
    res.redirect('/');
});



app.listen(3000, ()=>{
    console.log('listening on 3000');
});

