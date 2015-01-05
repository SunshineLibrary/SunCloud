'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Folder = mongoose.model('Folder'),
    File = mongoose.model('File'),
    _ = require('underscore'),
    async = require('async'),
    path = require('path');
var Q = require('q');
var fs = require('fs');
var util = require('util');
var file_path = __dirname + '/../../upload/sunpack/';




/**
 * When deleting a folder, also delete files in it.
 * @param res
 * @param result
 * @param done
 */
exports.deleteFolder = function(res, result, done) {
    console.log(result);
    var folder = result[0];
    async.each(folder.files, function(file, callback) {
        File.findOneAndRemove(file, function(err) {
            callback(err);
        })
    }, function(err) {
        if(err) {
            done(err);
        }else {
            done();
        }
    })
};

//exports.downloadApk = function(req, res) {
//    var access_token = req.query.access_token;
//    var apkId = parseInt(req.param('apkId'));
//    App.findOne({'apks.id': apkId}, function(err, app) {
//        if(err) {
//            console.error(err);
//            res.status(500).send({message: "数据库错误，请重试"});
//        } else {
//            var apk = _.findWhere(app.apks, {id: apkId});
//            console.log('downloading....' + app.name);
//            res.download(file_path+apk.fileName, function(err){
//                if(err) {
//                    console.error(err);
//                }else {
//                    //Record.findOne({access_token: access_token}, function(err, record) {
//                    //    if(err) {
//                    //        console.error(err);
//                    //    }else {
//                    //        apk.downloadedStudents.push(record.userId);
//                    //        app.save(function(err) {
//                    //            if(err) {
//                    //                console.error(err);
//                    //            }
//                    //        })
//                    //    }
//                    //});
//                }
//            });
//            //console.log(apk);
//        }
//    });
//
//};

