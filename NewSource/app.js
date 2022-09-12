var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //save erros
var flash        = require('req-flash');
var fs = require('fs')

// const helmet = require("helmet");
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const dotenv = require("dotenv");
const  mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const pathConfig = require('./path');
const { Dropzone } = require("dropzone");


// Define Path
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';
global.__path_configs   = __path_app + pathConfig.folder_configs + '/';
global.__path_helpers   = __path_app + pathConfig.folder_helpers + '/';
global.__path_routers   = __path_app + pathConfig.folder_routers + '/';
global.__path_schemas   = __path_app + pathConfig.folder_schemas + '/';
global.__path_validates = __path_app + pathConfig.folder_validates + '/';
global.__path_views     = __path_app + pathConfig.folder_views + '/';
global.__path_model   = __path_app + pathConfig.folder_model + '/';
global.__path_public      = __base + pathConfig.folder_public + '/';
global.__path_uploads     = __path_public + pathConfig.folder_uploads + '/';
const systemConfig = require(__path_configs + 'system');


var app = express();

dotenv.config();
//connect MongoDB to Node.js Using Mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then( () => console.log("Database connect successfully"))
  .catch((err) => {
     console.log(err);
  })


// view engine setup
app.set('views', path.join(__dirname, 'app/views/backend'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __path_views + 'backend/backend');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(helmet());
app.use(session({ secret: '123' }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(logger(':method :url :status - :date[web]', { skip: function (req, res) { return res.statusCode < 400 }, stream: accessLogStream }))

// Local variable >>> ejs called
app.locals.systemConfig = systemConfig;
// Setup router
app.use('/', require(__path_routers + 'frontend/index'));
app.use(`/${systemConfig.prefixAdmin}`, require(__path_routers + 'backend/index'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if (req.url == '/') {
    res.redirect("/index")
    return;
   } else if(req.url == `/${app.locals.systemConfig.prefixAdmin}`){
    res.redirect(`${app.locals.systemConfig.prefixAdmin}/dashboard`)
    return;
   } else if(req.url == `/${app.locals.systemConfig.prefixAdmin}/`){
    res.redirect(`dashboard`)
    return;
   } else {
    res.redirect("/index")
    return;
   }
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
