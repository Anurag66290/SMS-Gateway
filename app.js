import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import fs from 'fs';
import indexRouter from './routes/index.js'


import fileUpload from 'express-fileupload';

import logger from 'logger'
import morgan from 'morgan';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(fileUpload({useTempFiles: true, tempFileDir: '/tmp/'}));
app.use(morgan('combined', {stream: logStream}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


import mongoose from 'mongoose'
// Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/Assignment';
mongoose.connect(mongoDB, {useNewUrlParser: true});
console.log("db connected")
// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.set('view engine', 'jade');


app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


app.listen(2000, () => {
    console.log("server started 2000");

})

export default app
