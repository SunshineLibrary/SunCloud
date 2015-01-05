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

var fileType = {
            image: ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png', 'svg'],
            audio : ['mp3', 'wav', 'wma', 'wv', '3gp', 'act', 'aiff', 'aac', 'amr', 'au', 'awb', 'dct', 'dss', 'dvf', 'flac', 'gsm', 'm4a', 'm4p', 'mmf', 'mpc', 'ogg', 'oga', 'opus', 'ra', 'rm', 'raw', 'sln', 'tta', 'vox'],
            video : ['mkv', 'avi', 'rm', 'rmvb', 'mp4', 'm4p', 'mpg', 'mp2', 'mpeg','mpe', 'mpv' ,'flv', 'ogv', 'drc', 'mng', 'mov', 'webm'],
            doc : ['doc', 'docx', 'ppt', 'pptx', 'txt', 'html', 'xls', 'xlsx', 'csv', 'tab'],
            ebook : ['epub', 'pdf', 'caj', 'jar'],
            application: ['apk', 'exe', 'dmg']
};
//var fileType = {
//    image :{
//        extension: ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png', 'svg'],
//        name: '图片'
//    },
//    audio: {
//        extension : ['mp3', 'wav', 'wma', 'wv', '3gp', 'act', 'aiff', 'aac', 'amr', 'au', 'awb', 'dct', 'dss', 'dvf', 'flac', 'gsm', 'm4a', 'm4p', 'mmf', 'mpc', 'ogg', 'oga', 'opus', 'ra', 'rm', 'raw', 'sln', 'tta', 'vox'],
//        name: '音频'
//    },
//    video: {
//        extension : ['mkv', 'avi', 'rm', 'rmvb', 'mp4', 'm4p', 'mpg', 'mp2', 'mpeg','mpe', 'mpv' ,'flv', 'ogv', 'drc', 'mng', 'mov', 'webm'],
//        name: '视频'
//    },
//    doc: {
//        extension : ['doc', 'docx', 'ppt', 'pptx', 'txt', 'html', 'xls', 'xlsx', 'csv', 'tab'],
//        name: '文档'
//    },
//    ebook: {
//        extension : ['epub', 'pdf', 'caj', 'jar'],
//        name: '电子书'
//    },
//    application: {
//        extension: ['apk', 'exe', 'dmg'],
//        name: '应用程序'
//    }
//};



exports.uploadFiles = function(req, res) {
    var folderId = req.param('folderId');
    console.log('folderId:',folderId);
    var file = new File(req.files.file);
    console.log(file);
    file.owner = req.user._id;
    var found = false;
    for (var key in fileType) {
        var arr = fileType[key];
        if (arr.indexOf(file.extension) > -1) {
            file.type = key;
            found = true;
            break;
        }
    }
    if(!found) {
        file.type = 'other';
    }
    fs.renameSync(file.path, file_path + file.name);
    Folder.findById(folderId, function(err, folder) {
        if(err) {
            console.error(err);
            res.status(500).send({message: "数据库错误，未能找到文件夹"});
        }
        if(folder) {
            console.log(folder);
            file.subject = folder.subject;
            file.semester = folder.semester;
            file.school = folder.school;
            file.path = file_path + file.name;
            file.save(function(err) {
                if(err) {
                    res.status(500).send({message: "数据库错误，未能保存此文件"});
                }
                folder.files = folder.files.concat(file._id);
                folder.save(function(err) {
                    if(err) {
                        res.status(500).send({message: "数据库错误，未能保存文件夹"});
                    }else {
                        res.status(200).send({message: "上传成功"});
                    }
                });
            });
        }else {
            res.status(404).send({message: "此文件夹不存在" + folderId});
        }

    });
};


exports.uploadFile = function(req, res) {
    var fileId = req.param('fileId');
    var file = new File(req.files.file);
    console.log(file);
    //res.status(200).send({message:'success'});
    //fs.renameSync(file.path, file_path + file.name);
    //Folder.findById(folderId, function(err, folder) {
    //    if(err) {
    //        console.error(err);
    //        res.status(500).send({message: "数据库错误，未能找到文件夹"});
    //    }
    //    if(folder) {
    //        console.log(folder);
    //        file.subject = folder.subject;
    //        file.semester = folder.semester;
    //        file.path = file_path + file.name;
    //        file.save(function(err) {
    //            if(err) {
    //                res.status(500).send({message: "数据库错误，未能保存此文件"});
    //            }
    //            folder.files = folder.files.concat(file._id);
    //            folder.save(function(err) {
    //                if(err) {
    //                    res.status(500).send({message: "数据库错误，未能保存文件夹"});
    //                }else {
    //                    res.status(200).send({message: "上传成功"});
    //                }
    //            });
    //        });
    //    }else {
    //        res.status(404).send({message: "此文件夹不存在" + folderId});
    //    }
    //});
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

exports.downloadFile = function(req, res) {
    var fileId = req.params.fileId;
    console.log(fileId);
    File.findById(fileId, function(err, file) {
        if(err) {
            console.error(err);
            res.status(500).send({message: "数据库错误，请重试"});
        }else {
            console.log(file.originalname);
            res.download(file_path + file.name, file.originalname, function(err) {
                if(err) {
                    console.error(err);
                }else {
                    console.info('download file success');
                }
            })
        }
    })

};
