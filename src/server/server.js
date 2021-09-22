var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var booksRouter = require('./routers/books-router');
var config = require('./config/config.json');
var app = express();
// var port = 8080;
app.use(morgan('dev'));
app.use(express.static('client'));

// Enable CORS on ExpressJS to avoid cross-origin errors when calling this server using AJAX
// We are authorizing all domains to be able to manage information via AJAX (this is just for development)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,recording-session");
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
console.log("PORT FROM JSON: ", config.port)
app.use('/books', booksRouter);
/*app.use('/books/search', booksRouter);
app.use('/books/update', booksRouter); */
app.listen(config.port);
console.log("Running app on port port. Visit: http://localhost:" + config.port + "/");