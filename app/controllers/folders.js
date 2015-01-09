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


exports.getFolderById = function (req, res, next, folderId) {
    Folder.findById(folderId, function(err, folder) {
        if(err) {
            return next(err);
        }
        if(!folder) {
            return next(new Error('未能找到该文件夹' + folderId));
        }
        req.folder = folder;
        next();
    });
};

exports.getFoldersByRoom = function(req, res) {
    var folderIds = req.room.sunpack;
    var folders = [];
    async.each(folderIds, function(folderId, callback) {
        Folder.findById(folderId).populate('subject').populate('semester').exec(function(err, folder) {
            if(err) {
                callback(err);
            }else {
                folders.push(folder);
                callback();
            }
        })
    }, function(err) {
        if(err) {
            res.status(500).send({message: '数据库错误，未能找到该班级的文件夹'});
        }else {
            res.status(200).send(folders);
        }
    })
};


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

/**
 * when editing the semester of a folder, also edit the semester of all the files under it .
 * @param req
 * @param res
 */
exports.editFolder = function(req, res) {
    var folderId = req.param('folderId');
    var folder = req.folder;
    var semester = req.body.semester;
    folder = _.extend(folder, req.body);
    folder.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }else {
            async.each(folder.files, function(fileId, callback) {
                File.findById(fileId, function(err, file) {
                    if(err) {
                        callback(err);
                    }
                    if(!file) {
                        callback('未能找到该文件');
                    }else {
                        file.semester = semester;
                        file.save(function(err) {
                            if(err) {
                                callback(err);
                            }else {
                                callback();
                            }
                        })
                    }
                })
            }, function(err) {
                if(err) {
                    console.error(err);
                    res.status(400).send({message: err});
                }else {
                    res.json(folder);
                }
            });
        }
    });


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

