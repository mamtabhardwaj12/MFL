var crud = require('crud-sdk');
var Q = require('q');
var config = require('../../config/config.json');
// var scf = require('../utils/scf');
var exception = require('../../config/exceptions.json');

exports.getData = function (dbConnection, dbName, collectionName, condition, sortBy, exclude) {
    var deferred = Q.defer();
    crud.sort(dbConnection, dbName, collectionName, condition, sortBy, exclude, function (err, data) {
        if (err) {
            deferred.reject(err);
        }
        if (data) {
            deferred.resolve(data);
        }
        // deferred.reject(exception.usernameException);
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
            if(collectionName=="PurchaseOrder"){
                deferred.resolve(exception.POException);
            }else{
                deferred.resolve(exception.conflict);
            }
            
        }
        else {
            //  Create (Store data in MongoDB)

            reqBody['version'] = makeid();
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
    reqBody['version'] = makeid();
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


exports.modifyData = function (dbConnection, dbName, collectionName, condition, updateData) {
    var deferred = Q.defer();

    crud.update(dbConnection, dbName, collectionName, updateData, condition, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }

    });

    return deferred.promise;
};





exports.deleteData = function (dbConnection, dbName, collectionName, condition, exclude) {
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
            // scf.log("data ==>>", data)
            crud.update(dbConnection, dbName, collectionName, updateData, condition, function (err, response) {
                if (err) {
                    
                    deferred.reject(err);
                }
                var result = {};
                result["response"] = response;
                result["email"] = data[0].email;
                // result["type"] = "organisation";

                deferred.resolve(result);
            });
        }
        else {
            deferred.reject(exception.notFound); // required json data
        }
    });
    return deferred.promise;
};

exports.aggregate = function (dbConnection, dbName, collectionName, condition) {
    var deferred = Q.defer();
    crud.aggregate(dbConnection, dbName, collectionName, condition, function (err, data) {
        if (err) {
            deferred.reject(err);
        }
        // scf.log("data =>", data);
        if (!data.length) {
            deferred.resolve(0);
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};

exports.readByCondition = function (dbConnection, dbName, collectionName, condition, exclude) {
    var deferred = Q.defer();
    // var paramNotReq = {_id:0};
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {

        if (err) {

            deferred.reject(err);
        } else if (data && data.length) {

            deferred.resolve(data);
        }
        else {

            var err = "Data not found";
            deferred.resolve([]);
        }

    });
    return deferred.promise;
};

exports.readById = function (dbConnection, dbName, collectionName, condition, data, exclude) {
    var deferred = Q.defer();
    //#ReadById (Read Data from MongoDB using Mongo ObjectId)
    crud.readById(dbConnection, dbName, collectionName, condition, data, function (err, result) {
        if (err) {// do something

            deferred.reject(err);
        }
        if (data && data.length) {

            deferred.resolve(data);
        }

    });
    return deferred.promise;
}


exports.limit = function (dbConnection, dbName, collectionName, condition, perPage, pageNo, exclude) {
    var deferred = Q.defer();
    // scf.log();
    // Limit (Read and Limit Data from MongoDB using condition)
    crud.limit(dbConnection, dbName, collectionName, condition, perPage, pageNo, exclude, function (err, data) {
        if (err) // do something
        {

            deferred.reject(err);
        }
        if (data) {

            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

exports.updateMultipleRecord = function (dbConnection, dbName, collectionName, updateData, condition, exclude) {
    var deferred = Q.defer();

    crud.updateMultiple(dbConnection, dbName, collectionName, updateData, condition, function (err, result) {
        if (err) {
            deferred.reject(err);
        }

        deferred.resolve(result);
    });

    return deferred.promise;
};


exports.updateSync = function (collectionName, updateData, condition, callBack) {
    return crud.update(config.connectionString, config.dbName, collectionName, updateData, condition, callBack);
};
exports.readByConditionSync = function (collectionName, condition, exclude, calback) {
    return crud.readByCondition(config.connectionString, config.dbName, collectionName, condition, exclude, calback);
};


function makeid() {
    var text = "";
    var possible = "AxCdEqrG6KLwNoPmYS5FsHI34UVkXRZa9cDefghijWlQn2ptuvMByz01OTJ78b";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


exports.sortByLimit = function (dbConnection, dbName, collectionName, condition, sortCondition, pageNo, perPage, exclude) {
    var deferred = Q.defer();
    crud.sortByLimit(dbConnection, dbName, collectionName, condition, sortCondition, pageNo, perPage, exclude, function (err, data) {
        if (err) 
        {
            deferred.reject(err);
        }
        if (data) {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}