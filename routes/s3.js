"use strict";

var express = require("express");
var router = express.Router();

var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage()});
var s3 = require("../models/S3");

router.post("/addToBucket", upload.single("newFile"), function (request, response) {
   console.log("file: ", request.file)
    s3.storeOn(request.file, function (error) {
        if (error) response.status(400).send(error);
        response.redirect("/")
    })
});

router.post("/addMultipleToBucket", upload.array("newFiles"), function (request, response) {
    console.log("Here");
    console.log("files: ", request.files);
    s3.storeMultipleOn(request.files, function (error, results) {
        if (error) {
            response.status(400).send(error)
        } else {
            console.log("results: ", results);
            response.send(results);
        }
    });
});


router.put("/getFromBucket", function (request, response) {
   s3.getFrom(request.body, function (error, data) {
       if (error) response.status(400).send(error);
       response.send(data);
   }) 
});



module.exports = router;