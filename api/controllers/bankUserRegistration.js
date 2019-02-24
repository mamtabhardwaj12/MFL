'use strict';

var util = require('util');
var bankUserRegService = require('../services/bankUserRegService');

module.exports = {
    createBankUser: createBankUser
};

function createBankUser(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  bankUserRegService.bankUser(req.body).then(function (response) {
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
