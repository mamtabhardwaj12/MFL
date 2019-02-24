'use strict';

var config = require('../../config/config.json');
var InvoiceService = require('../services/InvoiceServices');

module.exports = {
    invoice: invoice,   
    updateInvoice: updateInvoice,
    deleteInvoice: deleteInvoice,
    updateInvoiceStatus: updateInvoiceStatus,
    getInvoice: getInvoice,
    getInvoiceById: getInvoiceById,
}


//  Create Invoice
function invoice(req, res, next) {
    var body = req.body;
      body.date = new Date();
      body["invoiceNumber"] = generateId();
    //   var advPaymentRate = 0.8;
    //   var advPayment = body.netInvoiceAmount * advPaymentRate;
    //   var avlLimit = body.availableLimit;
    //   body.advancePayment = advPayment;
    //   avlLimit = advPayment - body.financedAmt;
    //   body.availableLimit = avlLimit;
    //   body["finanaceAmt"] = avlLimit;
      InvoiceService.invoice(req,body)
        .then(function (response) {
          res.json(response);
        })
        .catch(function (response) {
          var statusCode = response.statusCode;
          var msg = response.message;
          res.status(statusCode).send({ message: msg });
        });
};

function generateId() {
  var id = config.invoice + Date.now();
  return id;
}


//  Update Invoice
function updateInvoice(req, res, next) {  
      var body = req.body;
      var id = req.swagger.params.id.value;
    
      InvoiceService.updateInvoice(req,id, body)
        .then(function (response) {
          // utils.writeJson(res, response);
          res.json(response);
        })
        .catch(function (response) {
          var statusCode = response.statusCode;
          var msg = response.message;
          res.status(statusCode).send({ message: msg });
        });
  };

  function updateInvoiceStatus(req, res, next) {

    var id = req.swagger.params.id.value;
    var body = req.body;
    InvoiceService.updateInvoiceStatus(id, body)
      .then(function (response) {
        res.json(response);
      })
      .catch(function (response) {
        var statusCode = response.statusCode;
        var msg = response.message;
        res.status(statusCode).send({ message: msg });
      });
  };

//  delete invoice data from DB
function deleteInvoice(req, res, next) {

      var id = req.swagger.params.id.value;
      var status = req.swagger.params.status.value;
      InvoiceService.deleteInvoice(id, status)
        .then(function (response) {
          res.json(response);
        })
        .catch(function (response) {
          var statusCode = response.statusCode;
          var msg = response.message;
          res.status(statusCode).send({ message: msg });
        });  
  };

function getInvoice(req, res, next) {

      // var invoiceNumber = req.swagger.params.invoiceNumber.value;
      var sort = req.swagger.params.sortBy.value || config.sortBy;
      var searchBy = req.swagger.params.searchBy.value;
      var supplierId = req.swagger.params.supplierId.value;
      InvoiceService.getInvoice(sort, searchBy,supplierId)
        .then(function (response) {
          res.json(response);
        })
        .catch(function (response) {
  
          res.json(response);
  
        });
  };

  function getInvoiceById(req, res, next) {
  
        var id = req.swagger.params.id.value;
        InvoiceService.getInvoiceById(req,id)
          .then(function (response) {
            res.json(response[0]);
          })
          .catch(function (response) {
            var statusCode = response.statusCode;
            var msg = response.message;
            res.status(statusCode).send({ message: msg });
          });
  };

//   function getInvoiceByInvoiceNumber(req, res, next) {
  
//     var invoiceNumber = req.swagger.params.invoiceNumber.value;

//     InvoiceService.getInvoiceByInvoiceNumber(req,invoiceNumber)
//       .then(function (response) {
       
//         res.json(response[0]);
//       })
//       .catch(function (response) {
//         var statusCode = response.statusCode;
//         var msg = response.message;
//         res.status(statusCode).send({ message: msg });
//       });
// };
  

