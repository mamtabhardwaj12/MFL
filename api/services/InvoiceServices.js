'use strict';

var config = require('../../config/config.json');
var Q = require('q');
var collectionName = 'Invoice';
var crud = require('../utils/CrudServices');

var MODULES = require('../helpers/module');
const STATUSCODES=MODULES.STATUSCODES();

exports.invoice = function (req, body) {

    var deferred = Q.defer();
        if (body.status !== STATUSCODES.New) {
          crud.createData(config.connectionString, config.dbName, collectionName, body)
            .then(data => {
              deferred.resolve(data);
            }).catch(err => { 
              deferred.reject({ statusCode: 200, message: "Can not create challan" });
            });
        } else {
          condition["status"] = { '$nin': [STATUSCODES.Discarded, STATUSCODES.Draft] };

          crud.insertData(config.connectionString, config.dbName, collectionName, condition, exclude, body)
            .then(data => {
              deferred.resolve(data);
          }).catch(err => {
              deferred.reject({ statusCode: 200, message: "Invoice with number " + body.invoiceNumber + " already present."});
          });
    }
  return deferred.promise;     
}

exports.updateInvoice = function(req, id, body) {
    var deferred = Q.defer();
    var condition = {};
      var sendCondition = {};
      sendCondition['id'] = id;
    if (body.status !== STATUSCODES.New) {
      
      crud.updateData(config.connectionString, config.dbName, collectionName, body, sendCondition, paramNotReq)
        .then(data => {
            deferred.resolve(data);
        }).catch(err => {
            deferred.reject({ statusCode: 200, message: "Can not create invoice." });
        });
    } else {

      body['createDate'] = new Date('' + req.root.date);
      if (!body.invoiceNumber || body.invoiceNumber === '') {
        body["invoiceNumber"] = generateId();
      }
      condition["status"] = { '$nin': [STATUSCODES.Discarded, STATUSCODES.Draft] };
      
      crud.readByCondition(config.connectionString, config.dbName, collectionName, condition, paramNotReq)
        .then(data => {

            deferred.reject({statusCode : 200 , message:  "Invoice with number " + body.invoiceNumber + " already present."})
        }) .catch(err => {
         
          crud.modifyData(config.connectionString, config.dbName, collectionName, sendCondition,body)
            
            .then(data => {
                deferred.resolve(data);
            }).catch(err => {    
                deferred.reject({ statusCode: 200, message: "Can not create invoice" });
            });
        });
    }
    return deferred.promise;
}

// Update an existing invoice singal value

exports.updateInvoiceStatus = function (id, body) {
    var deferred = Q.defer();
    var condition = {};
    condition["id"] = id;
  
    //  Update (Store data in MongoDB)
    return crud.updateData(config.connectionString, config.dbName, collectionName, body, condition, paramNotReq);
  }

//Delete invoice by invoice number
  exports.deleteInvoice = function (id, status) {
    var deferred = Q.defer();
    var condition = {};
    var data = {};
    condition["id"] = id;
    data["status"] = status;
    //  Delete (Delete data from MongoDB)
    if (id) {
      return crud.updateData(config.connectionString, config.dbName, collectionName, data, condition, paramNotReq);
    }
    else {
  
      return exception.invalid;
    }
  }