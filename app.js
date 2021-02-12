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
//items schema
const itemsSchema ={
    name: String
};

const Item = mongoose.model('item', itemsSchema);
const day = date.getDate();
const item1 = new Item({name: "Welcome to your todo list!"});
const item2 = new Item({name: "Hit the + to add a new item"});
const item3 = new Item({name: "<-- Hit the when you've finished an item"});
const defaultItems = [item1, item2, item3];

//list schema
const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model('List', listSchema);

//get list
app.get('/', (req, res)=>{
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
            res.render("list", {listTitle: day, newListItems :respose});
        }
    });
});

//add items
app.post('/', (req, res)=>{
    const itemsName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item({name: itemsName});
    //check to see if the list is a custom or default list
    if(listName === day){
        newItem.save();
        res.redirect('/');
    } else{
        //find the list and save it into the array of items on the list
        List.findOne({name: listName}, (err, foundList)=>{
            foundList.items.push(newItem);
            foundList.save();
            //redirect back to the list url
            res.redirect('/' + listName);
        })
    }
    
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

//custom lists
app.get('/:customList', (req, res)=>{
    const listName = req.params.customList;
    List.findOne({name: listName}, (err, result)=>{
         if(!err){
             if(result){
                 //show list
                 console.log('found');
                 res.render("list", {listTitle: result.name, newListItems :result.items})
             }else{
                 //create new list
                const list = new List({
                    name: listName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/');
                console.log('new list created');
             }
         }
     })
});

app.listen(3000, ()=>{
    console.log('listening on 3000');
});

 