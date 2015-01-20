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
var Room = mongoose.model('Room');


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

exports.getFoldersByRoomAndTeacher = function(req, res) {
    var folderIds = req.room.sunpack;
    var folders = [];
    var teacherId = req.user._id;
    async.each(folderIds, function(folderId, callback) {
        Folder.findById(folderId).populate('subject').populate('semester').exec(function(err, folder) {
            if(err) {
                callback(err);
            }else {
                if(folder){
                    //console.log(folder);
                    if((folder.owner.toString() === teacherId.toString())) {
                        folders.push(folder);
                    }
                }
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

exports.getFoldersCountByRoomAndTeacher = function(req, res) {
    var folderIds = req.room.sunpack;
    var count = 0;
    var teacherId = req.user._id;
    async.each(folderIds, function(folderId, callback) {
        Folder.findById(folderId).exec(function(err, folder) {
            if(err) {
                callback(err);
            }else {
                if(folder){
                    //console.log(folder);
                    if((folder.owner.toString() === teacherId.toString())) {
                        count += 1;
                    }
                }
                callback();
            }
        })
    }, function(err) {
        if(err) {
            res.status(500).send({message: '数据库错误，未能找到该班级的文件夹'});
        }else {
            res.status(200).send({count: count});
        }
    })
};


/**
 * When deleting a folder, also delete the ref in Room.sunpack
 * @param res
 * @param result
 * @param done
 */
exports.deleteFolder = function(res, result, done) {
    var folder = result[0];
    //Room.find({sunpack: folder._id}, function(err, rooms) {
    //    if(err) {
    //        console.error(err);
    //    }else {
    //        console.log(rooms);
    //    }
    //});
    Room.update({sunpack: folder._id}, {$pull: {sunpack: folder._id}}, function(err) {
        if(err) {
            done(err);
        }else {
            done();
            //async.each(folder.files, function(fileId, callback) {
            //    File.findByIdAndRemove(fileId, callback);
            //}, function(err) {
            //    done(err);
            //})
        }
    });


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

