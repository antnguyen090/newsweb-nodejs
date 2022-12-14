var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan'); //save erros
var flash        = require('req-flash');
var fs = require('fs')
const passport = require('passport')

// const helmet = require("helmet");
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const dotenv = require("dotenv");
const  mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const pathConfig = require('./path');
const app = express();


// Define Path
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';
global.__path_configs   = __path_app + pathConfig.folder_configs + '/';
global.__path_helpers   = __path_app + pathConfig.folder_helpers + '/';
global.__path_routers   = __path_app + pathConfig.folder_routers + '/';
global.__path_routers_backend   = __path_app + pathConfig.folder_routers_backend + '/';
global.__path_routers_frontend   = __path_app + pathConfig.folder_routers_frontend + '/';
global.__path_schemas_backend   = __path_app + pathConfig.folder_schemas_backend + '/';
global.__path_validates_backend = __path_app + pathConfig.folder_validates_backend + '/';
global.__path_views_backend     = __path_app + pathConfig.folder_views_backend + '/';
global.__path_model_backend   = __path_app + pathConfig.folder_model_backend + '/';
global.__path_schemas_frontend   = __path_app + pathConfig.folder_schemas_frontend + '/';
global.__path_validates_frontend = __path_app + pathConfig.folder_validates_frontend + '/';
global.__path_views_frontend     = __path_app + pathConfig.folder_views_frontend + '/';
global.__path_model_frontend   = __path_app + pathConfig.folder_model_frontend + '/';
global.__path_middleware   = __path_app + pathConfig.folder_middleware + '/';


global.__path_public      = __base + pathConfig.folder_public + '/';
global.__path_uploads     = __path_public + pathConfig.folder_uploads + '/';
const systemConfig = require(__path_configs + 'system');
const layoutFrontEnd	     = __path_views_frontend + 'frontend';
const layoutBackEnd	     = __path_views_backend + 'backend';


dotenv.config();
//connect MongoDB to Node.js Using Mongoose
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then( () => console.log("Database connect successfully"))
  .catch((err) => {
     console.log(err);
  })
app.use(cookieParser());
app.use(session({
  secret: 'abcnhds',
  saveUninitialized: false,
  resave: true,
  rolling: true,
  cookie: {
    maxAge: 5*60*10000
  }
}
));

require(__path_configs + 'passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
 app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'app/views/frontend'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __path_views_frontend + '/frontend');

app.use(logger('dev'));



// parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(logger(':method :url :status - :date[web]', { skip: function (req, res) { return res.statusCode < 400 }, stream: accessLogStream }))

// Local variable >>> ejs called
app.locals.systemConfig = systemConfig;
// Setup router
app.use('/', require(__path_routers_frontend + '/index'));
app.use(`/${systemConfig.prefixAdmin}`, require(__path_routers_backend + '/index'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.redirect('/error')
});

module.exports = app;
