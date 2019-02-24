'use strict';

var util = require('util');
var borrowerUserRegService = require('../services/borrowerUserRegService');

module.exports = {
    createOrgUser: createBorrowerUser
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function createBorrowerUser(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
//   console.log("Req:",req.body);
borrowerUserRegService.borrowerUser(req.body).then(function (response) {
    res.json(response);
  })
    .catch(function (response) {

      var statusCode = response.statusCode;
      var msg = response.message;
      res.status(statusCode).send({ message: msg });
    });

//   var name = req.swagger.params.name.value || 'stranger';
//   var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
//   res.json(hello);
}
