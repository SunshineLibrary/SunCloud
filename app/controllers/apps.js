'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    App = mongoose.model('App'),
    _ = require('underscore'),
    path = require('path');
var Record = mongoose.model('UserTablet');
var Room = mongoose.model('Room');
var Q = require('q');

var fs = require('fs');
var util = require('util');
var ApkReader = require('adbkit-apkreader');
var file_path = __dirname + '/../../upload/';



exports.upload = function(req, res, next) {
    //console.log('user:' + req.user);
    var file = req.files.file;
    var newApk = {};
    var reader = ApkReader.readFile(file.path);
    var manifest = reader.readManifestSync();
    newApk = {
        versionCode: parseInt(manifest.versionCode),
        versionName: manifest.versionName,
        package: manifest.package,
        size: file.size,
        id: parseInt(new Date().getTime() /1000) ,
        created_at: Date.now()
};

    var new_fileName = file.originalname.substr(0, file.originalname.lastIndexOf('.')) + '_' + newApk.versionCode + '.apk';
    var appId = req.param('appId');
    if(file.extension !== 'apk') {
        res.status(406).send({message: '只能上传后缀名为apk的文件'});
    }else{
        App.findOne({_id: appId}, function(err, app){
           if(err){
               console.error(err);
               res.status(500).send({message: '数据库错误，请重试'});
           }else{
               if(app.package && (newApk.package !== app.package)) {
                   res.status(406).send({message: '此文件内部包名和之前包名不一致，请确认此安装包是否正确'});
               }else{
                   fs.renameSync(file.path, file_path + new_fileName);

                   newApk.fileName = new_fileName;
                   app.apks = _.filter(app.apks, function(apk) {
                       return apk.fileName !== newApk.fileName;
                   });
                   app.apks = app.apks.concat(newApk);
                   app.package = newApk.package;
                   app.file_path = file_path;
                   //app.file_name =max.fileName;
                   app.save(function(err){
                       if(err) {
                           console.error(err);
                           res.status(500).send({message: '数据库错误，请重试'});
                       }else{
                           res.status(200).send(newApk);
                       }
                   });
               }
           }
        });
    }
};

var getMyApps = function(userId) {
    var deferred = Q.defer();
    var myApps = [];
    Room.find({students: userId}, function(err, rooms) {
        if(err) {
            console.error(err);
            deferred.reject(err);
        }else {
            var roomIds = _.map(rooms, function(room) {
                return room._id
            });
            App.find({rooms: {$in: roomIds}}, function(err, apps) {
                if(err) {
                    console.error(err);
                    deferred.reject(err);
                }
                deferred.resolve(apps);
            })
        }
    });
    return deferred.promise;
};

exports.getUpdate = function(req, res) {
    console.log('getting updates');
    var access_token = req.query.access_token;
    console.log(access_token);
    var user;
    Record.findOne({access_token: access_token}).populate('userId').exec(function(err, record) {
       if(err) {
           console.error(err);
           res.status(500).send({message: "数据库错误，请重试"});

       }else {
           console.log('finding....');
           //console.log(record);
           if(record) {
               user = record.userId;
               var apkUpdates = [];
               getMyApps(user._id).then(function(myApps) {
                   _.each(myApps, function(app) {
                       //console.log(app.apks);
                       if(app.apks.length) {
                           var latestApk = _.max(app.apks, function(apk) {
                               return apk.versionCode;
                           });
                           var theLatestApk = {id: parseInt(latestApk.id), name: latestApk.package,version: latestApk.versionCode};
                           apkUpdates.push(theLatestApk);
                       }

                   });
                   console.log(apkUpdates);
                   res.status(200).send(apkUpdates);
               }, function(err) {
                   console.error(err);
                   res.status(500).send({message: "获取更新失败"});
               });
           }else {
               console.error('找不到登录信息');
               res.status(404).send({message: "找不到登录信息"});
           }

       }
    });
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
    //var doc = App.apks.id("547da732b0be1c00006b36aa");


    //res.download(file_path+fileName, function(err){
    //    if (err) {
    //        // handle error, keep in mind the response may be partially-sent
    //        // so check res.headersSent
    //    } else {
    //        // decrement a download credit etc
    //    }
    //});

};