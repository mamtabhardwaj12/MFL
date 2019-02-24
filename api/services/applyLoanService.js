var config = require('../../config/config.json');
var crud = require('../utils/CrudService');
// var router = express.Router();
var request = require('request');

var Q = require('q');
var collectionName = 'Loan';


exports.applyLoan = function (body) {
    var deferred = Q.defer();

    var condition = {};
    var paramNotReq = {
        challanDate: 1,
        _id: 0
    };
    // if (id) {
    condition["invoiceNumber"] = body.invoiceNumber;
    condition["gstNumber"] = body.gstNumber;
    // }
    var sortField = {};

    crud.getData(config.connectionString, config.dbName, collectionName, condition, sortField, paramNotReq).then(data => {
        console.log("data", data);
        if (data.length > 0) {
            deferred.reject({ statusCode: 400, message: "Loan already applied" });
        }
        else {
            crud.createData(config.connectionString, config.dbName, collectionName, body)
                .then(data => {
                    console.log("Success:", data);
                    deferred.resolve(data);
                }).catch(err => {
                    console.log("Error:", err)
                    deferred.reject({ statusCode: 200, message: "Can not apply for loan" });
                });
        }
    }).catch(err => {
        console.log("Error:", err)
        deferred.reject({ statusCode: 200, message: "Can not apply for loan" });
    });

    return deferred.promise;
}