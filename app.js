//jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const e = require('express');

const app = new express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', 
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const itemsSchema ={
    name: String
};
const Item = mongoose.model('item', itemsSchema);
const item1 = new Item({name: "Welcome to your todo list!"});
const item2 = new Item({name: "Hit the + to add a new item"});
const item3 = new Item({name: "<-- Hit the when you've finished an item"});
const defaultItems = [item1, item2, item3];

//get list
app.get('/', (req, res)=>{
    const day = date.getDate();
    Item.find({}, (err, respose)=>{
        if(err){
            console.log(err);
        } else{
            if(respose.length === 0){
                Item.insertMany(defaultItems, err =>{
                    if(err){
                        console.log();
                    }else{
                        console.log('Items were added successfully.');
                    }
                });
                res.redirect('/');
            } else
            res.render("list", {day: day, newListItems :respose});
        }
    });
});

//add items
app.post('/', (req, res)=>{
    const itemsName = req.body.newItem;
    const newItem = new Item({name: itemsName});
    newItem.save();
    res.redirect('/');
});

//delete from list
app.post('/delete', (req, res)=>{
    const itemId = req.body.checkbox;
    Item.findByIdAndRemove(itemId, err=>{
        if(err){
            console.log(err);
        }else{
            console.log('successfully deleted');
        }
    });
    res.redirect('/');
});

app.get('/:list', (req, res)=>{
    console.log(req.params.list);
});

app.listen(3000, ()=>{
    console.log('listening on 3000');
});

 