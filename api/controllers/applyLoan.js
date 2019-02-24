'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/
var util = require('util');


module.exports = {
    applyLoan: applyLoan
};

var loanService = require('../services/applyLoanService');

function applyLoan(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  loanService.applyLoan(req.body).then(function (response) {
    res.json(response);
  })
    .catch(function (response) {

      var statusCode = response.statusCode;
      var msg = response.message;
      res.status(statusCode).send({ message: msg });
    });
}
