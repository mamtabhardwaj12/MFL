'use strict';

var config = require('../../config/config.json');
var Q = require('q');
var collectionName = 'Invoice';
var crud = require('../utils/CrudService');

//var baseService = require('./BaseService');
var MODULES = require('../helpers/module');
const STATUSCODES=MODULES.STATUSCODES();
var paramNotReq = {};



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

function generateId() {
  var id = config.invoice + Date.now();
  return id;
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


  exports.getInvoice = function (invoiceNumber, sort, searchBy) {
    var deferred = Q.defer();
    var condition = {};


    // if(invoiceNumber.length){
    //   console.log('Name exists already',null);
    // }
    
    condition["invoiceNumber"] = invoiceNumber;
    crud.readByCondition(config.connectionString, config.dbName, collectionName, condition, paramNotReq)
    .then(data => {
      deferred.resolve(data)
        }) .catch(err => {
        deferred.reject(err)
        })
    
    if (searchBy) {
      var filter = searchBy.invoiceNumber;
      var data1 = {};
      var data2 = {};
      var data3 = {};
  
      data1 = filter[0];
      data2 = filter[1];
      data3 = filter[2];
  
      condition[data1.key] = data1.value;
      condition[data2.key] = data2.value;
      condition["status"] = "Approved";
    }
  
    if (sort) {
      var sortBy = sort.split("_")[0];
      var value = sort.split("_")[1];
      if (value === "asc") {
        var sortValue = 1;
      } else if (value === "desc") {
        var sortValue = -1;
      } else {
        res.json(exception.badRequest);
      }
    }
    // var sortField = {};
    // var sortBy = sortBy;
    // sortField[sortBy] = sortValue;
  
    // if (supplierId) {
    //   scf.log("supplierId =>>", supplierId);
    //   condition["supplierId"] = supplierId;
    // }
  
    // if (searchBy == null && supplierId == null) {
    //   condition["status"] = { '$ne': "Discard" };
    // }
  
    return crud.getData(config.connectionString, config.dbName, collectionName, condition, paramNotReq);
  }

  // exports.getInvoice = function(req, id) {

  //   if(id = id) {
  //     console.log("Invoice already exist");
  //   } else {
  //     req.send(err);
  //   }
  // }

  // get data by id

exports.getInvoiceById = function (req, id) {
  var condition = {};
  //if (id) {
    condition["id"] = req.query.id;
    crud.readByCondition(config.connectionString, config.dbName, collectionName, condition, paramNotReq)
    .then(data => {
      deferred.resolve(data)
        }) .catch(err => {
        deferred.reject(err)
        })
  //}
  console.log("InvoiceId: ", id);
  var paramNotReq = {};
  //var sortField = {};
  //return baseService.fetchPermissionEnabledDocuments(req,collectionName,condition, sortField, paramNotReq);
    
  //  Get (Get data from MongoDB)
  return crud.getData(config.connectionString, config.dbName, collectionName, condition, paramNotReq);

}


// exports.getInvoiceByInvoiceNumber = function (req, invoiceNumber) {
//   var condition = {};

//   if (invoiceNumber && invoiceNumber == null) {
//     condition["invoiceNumber"] = invoiceNumber;
//     condition["status"] = { '$ne': "Discard" };
//   }

//   var paramNotReq = {
//     _id: 0
//   };
//   var sortField = {};

//   //  Read (Read data from MongoDB)
//   return baseService.fetchPermissionEnabledDocuments(req,collectionName,condition, sortField, paramNotReq);
//   // return crud.getData(config.connectionString, config.dbName, collectionName, condition, sortField, paramNotReq)
// }
  