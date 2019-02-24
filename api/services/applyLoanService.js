var config = require('../../config/config.json');
var crud = require('../utils/CrudService');
// var router = express.Router();
var request = require('request');

var Q = require('q');
var collectionName = 'Loan';


exports.applyLoan = function (body) {
    var deferred = Q.defer();

      crud.createData(config.connectionString, config.dbName, collectionName, body)
        .then(data => {
          deferred.resolve(data);
        }).catch(err => {
          console.log("Error:",err)
          deferred.reject({ statusCode: 200, message: "Can not apply for loan" });
        });
    return deferred.promise;
  }