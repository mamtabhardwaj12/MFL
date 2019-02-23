'use strict';

var SwaggerExpress = require('swagger-express-mw');
var morgan = require('morgan');
var winston = require('./api/utils/winston');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
module.exports = app; // for testing


//Node Module for swagger with express framework
var swaggerUi = require('swagger-ui-express');

//Path of swagger.json file in your app directory
var swaggerDocument = require('./api/swagger/swagger.json');

app.use(bodyParser.json(), function (req, res, next) {

  // var allowedOrigins = ['https://localhost:4200', 'http://localhost:4200', 'https://127.0.0.1:4200', 'https://169.38.76.104:4200', 'http://169.38.76.104:4200','http://169.38.76.103:4200'];

  var origin = req.headers.origin;
  // if (allowedOrigins.indexOf(origin) > -1) {
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  // res.setHeader('Access-Control-Allow-Origin', origin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HMAC-HASH, X-MICRO-TIME");
  res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HMAC-HASH, X-MICRO-TIME");

   next();

});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// used for logs
app.use(morgan('combined', { stream: winston.stream }));

// error handler for logging using winston
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  // next();
  res.send(err);
});

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/MFL']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
