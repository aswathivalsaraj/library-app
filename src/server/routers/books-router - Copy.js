var booksRouter = require('express').Router(); 
const fs = require('fs')
const path = require("path");
var res = require('../data/books-data.js')
var booksData = require('../data/books-data');
var _ = require('lodash');

var books = booksData;
var id = 12;

function readFile(filePath){
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
          return "Error";
        }
        try {
          const object = JSON.parse(fileData.books);
          return object;
        } catch (err) {
            return "Error";
        }
      });
}


var updateId = function (req, res, next) {
    console.log(req.body);
    if (!req.body.id) {
        id++;
        req.body.id = id + '';
    }
    next();
};

var readFile = function(req, res, next) {    
    fs.readFile("./src/assets/data/books-data.json", "utf8", (err, jsonString) => {
        if (err) {
          return { response: "File read failed"};
        }
        return jsonString;
      });
    next()
}

booksRouter.get('/:id', function (req, res) {
    var event = req.event;
    res.json(event || {});
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
booksRouter.post('/update/', function (req, res, next) {   
    if(req.body.id && Number(req.body.id) > 0) {
        for(i=0; i<books.length; i++) {
            if(Number(books[i].id) === Number(req.body.id)){
                books[i].title = req.body.title;
                break;
            }
        }
        const jsonString = JSON.stringify(books);
        fs.writeFile('./src/assets/data/books-data.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    } else {
        for(i=0; i<books.length; i++) {
            if(Number(books[i].id) === Number(req.body.id)){
                books[i].title = req.body.title;
                break;
            }
        }
        const newBook = {}
        newBook.id  = (books.length + 1).toString();
        newBook.topic = req.body.topic;
        newBook.title = req.body.title;
        newBook.summary = req.body.summary;
        books.push(newBook)
        const jsonString = JSON.stringify(books);
        fs.writeFile('./src/assets/data/books-data.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Added new book')
            }
        })
    }
  });

booksRouter.post('/', updateId, function (req, res) {
    var event = req.body;
    events.push(event);
    res.status(201).json(event || {});
});

booksRouter.put('/:id', function (req, res) {
    var update = req.body;
    if (update.id) {
        delete update.id;
    }
    var event = _.findIndex(events, {id: req.params.id});
    if (!events[event]) {
        res.send();
    } else {
        var updatedEvent = _.assign(events[event], update);
        res.json(updatedEvent);
    }
});

booksRouter.get('/', function (req, res) {
    res.json(books);
});
booksRouter.delete('/delete/:id', function (req, res) {
    var event = _.findIndex(events, {id: req.params.id});
    events.splice(event, 1);
    res.json(req.event);
});

booksRouter.use(function (err, req, res, next) {
    if (err) {
        res.status(500).send(err);
    }
});
booksRouter.param('id', function (req, res, next, id) {
    var event = _.find(books, {id: id});
    if (event) {
        req.event = event;
        next();
    } else {
        res.json({"error": "Id not foundddd"});
    }
});

module.exports = booksRouter;