var booksRouter = require('express').Router(); 
const fs = require('fs')
const path = require("path");
var _ = require('lodash');
var jsonFilePath = "../data/books-data.json";
var books = [];

booksRouter.get('/', function (req, res) {
    fs.readFile((path.resolve(__dirname, jsonFilePath)), 'utf8', (err, data) => {
        if (err) {
            res.json({ Error: "File read failed" });
        }
        books = JSON.parse(JSON.stringify(data));
        res.send(data);
    });
});

function readJson() {
    var resp = fs.readFile((path.resolve(__dirname, jsonFilePath)), 'utf8', (err, data) => {
        if (err) {
            res.json({ Error: "File read failed" });
        }
        books = JSON.parse(JSON.stringify(data));
    });
}
booksRouter.get('/:id', function (req, res) {  
    var x = readJson();
    if(books && books.length > 0 && req.params.id) {   
        var bookSelected = _.filter(JSON.parse(books), { id: req.params.id });
        res.send(bookSelected);
    }
});

booksRouter.post('/', function (req, res, next) { 
    let allbooks = [];
    allbooks = (books && JSON.parse(books).length > 0 ) ? JSON.parse(books): req.body.allBooks;
    const newBook  = req.body.newBook;
    allbooks.push(newBook);   
    fs.writeFile((path.resolve(__dirname, jsonFilePath)), JSON.stringify(allbooks), err => {
        if (err) {
            res.json({ response: "Error while adding new item" });
        } else {       
            books = allbooks;     
            res.json({ response: "Added new item" });
        }
    });
  });

booksRouter.delete('/:id', function (req, res) {
    const allbooks = JSON.parse(books);
    let index = _.findIndex(allbooks, {id: req.params.id});     
    if (index > -1) {       
       var newList = allbooks.splice(index, 1);        
        for(i=index; i < allbooks.length; i++) {  
            allbooks[i].id = (Number(allbooks[i].id)-1).toString();
        }
    }
    fs.writeFile((path.resolve(__dirname, jsonFilePath)), JSON.stringify(allbooks), err => {
        if (err) {
            res.send('Error writing file');
        } else {            
            res.send(allbooks);
        }
    }); 
});

booksRouter.put('/:id', function (req, res) {
   console.log("Inside update")
   allbooks = (books && JSON.parse(books).length > 0 ) ? JSON.parse(books): [];
   if(allbooks.length > 0) {
    var index = _.findIndex(allbooks, {id: req.params.id });
    console.log("index", index, req.body);
    if(index >= 0) {
        allbooks.splice(index, 1, req.body);
        console.log(allbooks)
    }    
    fs.writeFile((path.resolve(__dirname, jsonFilePath)), JSON.stringify(allbooks), err => {
        if (err) {
            res.send('Error writing file');
        } else {            
            res.send(allbooks);
        }
    }); 
   }
});



booksRouter.use(function (err, req, res, next) {
    if (err) {
        res.status(500).send(err);
    }
});

booksRouter.post('/search/', function (req, res, next) {
    if(req.body.title) {
      var result = books.filter((e, i) => { return (e.title).match(req.body.title) })     
      if(result && result.length > 0) {
          res.send(result);
      } else{
          res.send("No Matching Found");
      }    
    } else {
      res.json({Error: "Title is missing"});
    }
});
module.exports = booksRouter;