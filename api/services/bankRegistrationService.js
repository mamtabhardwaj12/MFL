var config = require('../../config/config.json');
var crud = require('../utils/CrudService');
// var router = express.Router();
var request = require('request');

var Q = require('q');
var collectionName = 'BankUser';


exports.bankRegister = function (body) {
    // body["date"] = config.DATE;
    var deferred = Q.defer();

    console.log("body",body);
      crud.createData(config.connectionString, config.dbName, collectionName, body)
        .then(data => {
          deferred.resolve(data);
        }).catch(err => {
          console.log("Error:",err)
          deferred.reject({ statusCode: 200, message: "Can not create challan" });
        });
    // } else {
    //   var exclude = {};
    //   var condition = {};
    //   body['createDate'] = new Date('' + req.root.date);
    //   if (!body.challanNumber || body.challanNumber === '') {
    //     body["challanNumber"] = config.challan + Date.now();
    //   }
    //   condition["challanNumber"] = body.challanNumber;
    //   condition["manufacturerId"] = body.manufacturerId;
    //   condition["supplierId"] = req.root.orgId;
    //   condition["challanDate"] = body.challanDate;
    //   condition["status"] = { '$nin': [STATUSCODES.Discarded, STATUSCODES.Draft, STATUSCODES.Rejected, STATUSCODES.Rejected_By_Manufacturer] };
  
    //   service.insertBaseModel(req.root, body.status, function (err, baseData) {
    //     body["createdBy"] = baseData.createdBy;
    //     body["creatorId"] = baseData.creatorId;
    //     body["createdOn"] = baseData.createdOn;
  
    //     crud.insertData(config.connectionString, config.dbName, collectionName, condition, exclude, body)
    //       .then(data => {
    //         if (body.finalChallan == true) {
    //           var poCondition = {};
    //           poCondition["poNumber"] = body.poNumber;
    //           var updateCondition = {};
    //           updateCondition["finalChallan"] = true;
    //           var poCollection = "PurchaseOrder";
    //           crud.modifyData(config.connectionString, config.dbName, poCollection, poCondition, updateCondition).then(response => {
  
    //             deferred.resolve(data);
  
    //           }).catch(err => {
  
    //             deferred.reject({ statusCode: 200, message: "PO number " + body.poNumberId + " not found." });
    //           });
    //         } else {
    //           deferred.resolve(data);
    //         }
  
    //       }).catch(err => {
    //         deferred.reject({ statusCode: 200, message: "Challan with number " + body.challanNumber + " already present." });
    //       });
    //   });
    // }
    return deferred.promise;
  }