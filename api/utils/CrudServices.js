var crud = require('crud-sdk');
var Q = require('q');
// var config = require('../../config/config.json');
// var scf = require('../utils/scf');
var exception = require('../../config/exceptions');

exports.getData = function (dbConnection, dbName, collectionName, condition, sortBy, exclude) {
    var deferred = Q.defer();
    crud.sort(dbConnection, dbName, collectionName, condition, sortBy, exclude, function (err, data) {
        if (err) {
            deferred.reject(err);
        }
        
        deferred.resolve(data);
    });
    return deferred.promise;
};

exports.insertData = function (dbConnection, dbName, collectionName, condition, exclude, reqBody) {
    var deferred = Q.defer();
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {
      
        if (err) {
            deferred.reject(err);
        }
        if (data && data.length) {
            deferred.reject(exception.conflict);
        }
        else {
            //  Create (Store data in MongoDB)
                    
            crud.create(dbConnection, dbName, collectionName, reqBody, function (err, data) {
                var result = {};
                if (err) {
                    deferred.reject(err);
                }
                var condition = {};
                condition["id"] = reqBody.id;
                var updateData = {
                    id: data.mongoId.toString()
                };
                crud.update(dbConnection, dbName, collectionName, updateData, condition, function (err, response) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve(data);
                });
            });
        }
    });
    return deferred.promise;
};

exports.createData = function (dbConnection, dbName, collectionName, reqBody) {
        var deferred = Q.defer();
    
        crud.create(dbConnection, dbName, collectionName, reqBody, function (err, data) {
    
            if (err) {
                deferred.reject(err);
            }
            var condition = {};
            condition["id"] = reqBody.id;
            var updateData = {
                id: data.mongoId.toString()
            };
            crud.update(dbConnection, dbName, collectionName, updateData, condition, function (err, response) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(data);
            });
        });
       
        return deferred.promise;
};

exports.modifyData = function (dbConnection, dbName, collectionName, condition,updateData) {
    var deferred = Q.defer();

    crud.update(dbConnection, dbName, collectionName, updateData, condition, function (err, data) {
        if (err) {
            deferred.reject(err);
        }else{
            deferred.resolve(data);
        }
        
    });
    
    return deferred.promise;
};

exports.deleteData = function (dbConnection, dbName, collectionName, condition, exclude) {
    // scf.log("condition:", condition);
    var deferred = Q.defer();
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {
        if (data == undefined) {
            deferred.reject(exception.unavailable);
        }
        if (err) {
            deferred.reject(err);
        }
        if (data && data.length) {
            crud.delete(dbConnection, dbName, collectionName, condition, function (err, result) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(result);
                }
            });
        }
        else {
            deferred.reject(exception.notFound);
        }
    });
    return deferred.promise;
};

exports.updateData = function (dbConnection, dbName, collectionName, updateData, condition, exclude) {
    var deferred = Q.defer();
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {
        if (data == undefined) {
            deferred.reject(exception.unavailable);
        }
        if (err) {
            deferred.reject(err);
        }
        if (data && data.length) {
            crud.update(dbConnection, dbName, collectionName, updateData, condition, function (err, response) {
                if (err) {
                    deferred.reject(err);
                }
                var result = {};
                result["response"] = response;
                result["email"] = data[0].email;
                result["type"] = "organisation";
                
                deferred.resolve(result);
            });
        }
        else {
            console.log("FIREDTHIS",data);
            deferred.reject(exception.notFound); // required json data
        }
    });
    return deferred.promise;
};