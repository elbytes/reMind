//jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
let items =[];

const app = new express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res)=>{
    let today = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    let day = today.toLocaleDateString('en-US', options);
    res.render("list", {day: day, newListItems :items});
});


app.post('/', (req, res)=>{
    items.push(req.body.newItem);
    res.redirect('/');
});



app.listen(3000, ()=>{
    console.log('listening on 3000');
});

