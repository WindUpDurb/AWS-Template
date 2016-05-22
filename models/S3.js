"use strict";

var AWS = require("aws-sdk");
var path = require("path");

var s3 = new AWS.S3();

var fs = require("fs");

var fileName = "fileToUpload.js";
var bucketName = "template-test-test";
var urlBase = "https://s3-us-west-1.amazonaws.com/";
var async = require("async");


var aws_s3 = {};
//to upload a file to the AWS bucket:

aws_s3.storeOn = function (dataToStore, callback) {
    let key = dataToStore.originalname.split(".")[0];
    let params = {
        Bucket: bucketName,
        Key: key,
        ACL: "public-read",
        Body: dataToStore.buffer
    };
    s3.upload(params, function (error, result) {
        if (error) return callback(error);
        callback(null, result);
    });
};

aws_s3.storeMultipleOn = function (dataToStore, callback) {


    async.forEachOf(dataToStore, function (file, index, callback2) {

        let key = `motherfuckingpizza${index}`;
        let params = {
            Bucket: bucketName,
            Key: key,
            ACL: "public-read",
            Body: file.buffer
        };
        console.log("each file:", file.buffer);
        console.log("i: ", index);

        s3.upload(params, function (error, result) {
            callback2()
        });
    }, function (error) {
        if (error) return callback(error);
        callback(null)
    });
};


aws_s3.getFrom = function (dataToFetch, callback) {
    let params = {
        Bucket: bucketName,
        Key: dataToFetch.key
    };
    s3.getObject(params, function (error, data) {
        if (error) return callback(error);
        var dataToReturn = data.Body.toString("utf-8");
        callback(null, dataToReturn);
    });
};

module.exports = aws_s3;

/*
fs.readFile(path.join(__dirname, `../${fileName}`), function (error, data) {
   if (error) throw error;

    var params = {
        Bucket: bucketName,
        Key: "test"
       // ACL: "public-read",
       // Body: data
    };
    
/!*    s3.putObject(params, function (error, result) {
        if (error) throw error;

        console.log("results: ", result);
    });*!/

    s3.getObject(params, function (error, data) {
        console.log("Data: ", data.Body.toString("utf-8"));
    })

});*/











