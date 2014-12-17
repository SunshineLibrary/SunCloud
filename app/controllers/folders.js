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



exports.uploadFile = function(req, res) {
    var folderId = req.param('folderId');
    console.log('folderId:',folderId);
    var file = new File(req.files.file);
    console.log(file);
    file.owner = req.user._id;
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

    //res.status(200).send({message: "上传成功"});


    //this is files:  { file:
    //{ fieldname: 'file',
    //    originalname: 'SunPack-release.apk',
    //    name: '701eb252df8c508b0f4d65c4b62096d2.apk',
    //    encoding: '7bit',
    //    mimetype: 'application/octet-stream',
    //    path: '/Users/Tao/SunshineLibrary/SunCloud/upload/tmp/701eb252df8c508b0f4d65c4b62096d2.apk',
    //    extension: 'apk',
    //    size: 1071714,
    //    truncated: false,
    //    buffer: null } }
    //
    //var new_fileName = file.originalname.substr(0, file.originalname.lastIndexOf('.')) + '_' + newApk.versionCode + '.apk';
    //var appId = req.param('appId');
    //if(file.extension !== 'apk') {
    //    res.status(406).send({message: '只能上传后缀名为apk的文件'});
    //}else{
    //    App.findOne({_id: appId}, function(err, app){
    //        if(err){
    //            console.error(err);
    //            res.status(500).send({message: '数据库错误，请重试'});
    //        }else{
    //            if(app.package && (newApk.package !== app.package)) {
    //                res.status(406).send({message: '此文件内部包名和之前包名不一致，请确认此安装包是否正确'});
    //            }else{
    //                fs.renameSync(file.path, file_path + new_fileName);
    //
    //                newApk.fileName = new_fileName;
    //                var successCode = 200;
    //                if(_.findWhere(app.apks, {versionCode: newApk.versionCode})) {
    //                    successCode = 201;
    //                    app.apks = _.filter(app.apks, function(apk) {
    //                        return apk.versionCode !== newApk.versionCode;
    //                    });
    //                }
    //                newApk.id = parseInt(new Date().getTime() /1000);
    //                app.apks = app.apks.concat(newApk);
    //                console.log('hello');
    //                console.log(app.apks);
    //                app.package = newApk.package;
    //                app.file_path = file_path;
    //                app.save(function(err){
    //                    if(err) {
    //                        console.error(err);
    //                        res.status(500).send({message: '数据库错误，请重试'});
    //                    }else{
    //                        res.status(successCode).send(newApk);
    //                    }
    //                });
    //            }
    //        }
    //    });
    //}
};

exports.downloadApk = function(req, res) {
    var access_token = req.query.access_token;
    var apkId = parseInt(req.param('apkId'));
    App.findOne({'apks.id': apkId}, function(err, app) {
        if(err) {
            console.error(err);
            res.status(500).send({message: "数据库错误，请重试"});
        } else {
            var apk = _.findWhere(app.apks, {id: apkId});
            console.log('downloading....' + app.name);
            res.download(file_path+apk.fileName, function(err){
                if(err) {
                    console.error(err);
                }else {
                    //Record.findOne({access_token: access_token}, function(err, record) {
                    //    if(err) {
                    //        console.error(err);
                    //    }else {
                    //        apk.downloadedStudents.push(record.userId);
                    //        app.save(function(err) {
                    //            if(err) {
                    //                console.error(err);
                    //            }
                    //        })
                    //    }
                    //});
                }
            });
            //console.log(apk);
        }
    });

};

