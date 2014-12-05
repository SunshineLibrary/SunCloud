'use strict';

/**
 * Module dependencies.
 */
var _ = require('underscore'),
    errorHandler = require('./errors'),
    mongoose = require('mongoose'),
    Q = require('q'),
    User = mongoose.model('User'),
    Tablet = mongoose.model('Tablet'),
    UserTablet = mongoose.model('UserTablet'),
    Room = mongoose.model('Room'),
    App = mongoose.model('App'),
    Q = require('q'),
    async = require('async');

/**
 * getAllowedApps
 * @param req
 * @param res
 */
var getAllowedApps = function(callback) {
    App.find({}, function(err, apps) {
        if(err) {
            console.error(err);
        }
        var allowedApps = _.map(apps, function(app) {
            return app.package;
        });
        callback(err, allowedApps);
    });
};

/**
 * findRom
 * @param userId
 * @param user_type
 * @param callback
 */
var findRoom = function (userId, user_type, callback) {
    var obj = { type: 'admin'};
    obj[ user_type ] = userId;
    Room.findOne(obj, callback);
};

/**
 *
 * @param req
 * @param res
 */
exports.getSchool = function(req, res) {
    console.log(req.body);
    console.log("hello world");
    var school = [{
        name: "阳光书屋",
        uuid: "235343552"
    },
        {
            name: "光合新知",
            uuid: "124333232342"
        }];

    //res.set('Content-Type', 'application/json');
    res.status(200).send(school);

};

/**
* Tablet Loggin
 */

exports.tabletLogin = function(req, res) {
    var username = req.body.name;
    var user_type = req.body.user_type;
    var machine_id = req.body.machine_id;
    var os_type = req.body.os_type;
    var os_version = req.body.os_version;
    var error;
    var errorCode = 401;
    async.waterfall([
       function(callback) {
           User.findOne({username: username}).populate('school').exec(function(err, user) {
               if(err) {
                   error = '数据库错误,请重试.';
                   errorCode = 500;
               }
               callback(error, user);
           })
       },
        function(user, callback) {
            if(!user) {
                    error = '用户名' + username + '不存在';
                    errorCode = 404;
            }
            console.log(error);
            callback(error, user);
        },
        function(user, callback) {
            if(!_.contains(user.roles, user_type)){
                user.roles.push(user_type);
                user.save(function(err){
                    if(err) {
                        console.error(err);
                        error = '数据库错误,请重试.';
                        errorCode = 500;
                    }
                })
            }
            callback(error, user);
        },
        function(user, callback) {
            Tablet.update({machine_id: machine_id},{machine_id: machine_id,OS_type: os_type, OS_version: os_version, school: user.school, lastUpdate: Date.now()},
                {upsert: true},function(err){
                    if(err) {
                        error = '数据库错误，请重试.';
                        errorCode = 500;
                    }
                    callback(error, user);
                });
        },
        function(user, callback) {
            Tablet.findOne({machine_id: machine_id}, function(err, tablet) {
                if(err) {
                    error = '数据库错误，请重试.';
                    errorCode = 500;
                }
                callback(error, user, tablet);
            })
        },
        function(user, tablet, callback) {
            UserTablet.findOne({userId: user._id, tabletId: tablet._id, logout_at: {$exists: false}}, function(err, record){
                if(err){
                    error = '数据库错误，请重试.';
                    errorCode = 500;
                }
                if(record) {
                    error = '你已经登录了该设备，请让老师在后台登出并重新登录.';
                    errorCode = 403;
                }
                console.log(tablet);
                callback(error, user, tablet);
            })
        },
        function(user, tablet, callback) {
            UserTablet.findOne({userId: user._id, logout_at: {$exists: false}},function(err, anotherTablet){
                if(err) {
                    error = '数据库错误，请重试.';
                    errorCode = 500;
                }
                if(anotherTablet) {
                    error = '错误：用户已登录到另一台设备上.';
                    errorCode = 403;
                }
                callback(error, user, tablet);
            })
        },
        function(user, tablet, callback) {
            UserTablet.findOne({tabletId: tablet._id, logout_at: {$exists: false}}).populate('userId').exec(function(err, anotherUser){
                if(err) {
                    error = '数据库错误，请重试.';
                    errorCode = 500;
                }
                if(anotherUser) {
                    error = '错误：另一个用户' + anotherUser.userId.name + '正在使用该设备，请先在后台登出';
                    errorCode = 503;                }
                callback(error, user, tablet)
            })
        },
        function(user, tablet, callback) {
            findRoom(user._id, user_type, function(err, room) {
                if(err) {
                    error = '数据库错误，请重试.';
                    errorCode = 500;
                }
                callback(error, user, tablet, room);
            })
        },
        function(user, tablet, room, callback) {
            getAllowedApps(function(err, allowedApps) {
                if(err) {
                    error = '获取应用白名单失败，请重试.';
                    errorCode = 500;
                }
                callback(error, user, tablet, room, allowedApps);
            })
        },
        function(user, tablet, room, allowedApps, callback) {
            var userInfo = {
                user_avatar: null,
                user_name: user.username,
                user_account_type: user_type,
                user_school: user.school.name,
                user_birthday: user.birthday,
                user_allowed_apps: allowedApps,
                user_grade: user.grade,
                user_class: room? room.name: '暂无班级',
                user_password: user.school.launcherPassword
            };
            console.log(userInfo);
            UserTablet.addRecord(user._id, tablet._id,function(err, newRecord) {
                if(err) {
                    error = '数据库错误，请重试.';
                    errorCode = 500;
                }
                console.log(newRecord);
                res.status(200).send({
                    status: 200,
                    message: "登录成功！",
                    access_token: newRecord.access_token,
                    user_info: userInfo
                });
                callback(error);
            })
        }
    ], function(err) {
        if(err) {
            console.error(err);
            console.log(errorCode);
            res.send({status: errorCode, message: err});
        }
    })
};

/**
 * Force user to logout from tablet
 */
exports.tabletLogout = function(req, res) {
    var tabletId = req.body.tabletId;
    var userId = req.body.userId;
    UserTablet.removeRecord(userId, tabletId,function(err,record){
        if(err){
            res.status(500).send({
                message: errorHandler.getErrorMessage(err)
            })
        }else{
            res.send(200);
        }
    });
};


exports.checkToken = function(req, res){
    var error = null;
    var errorCode = 401;
    async.waterfall([
            function(callback) {
                UserTablet.findOne({access_token: req.query.access_token}, function(err, record){
                    if(err) {
                        console.error(err);
                        error = '数据库错误，请重试.';
                        errorCode = 500;
                    }
                    if(!record) {
                        error = '登录失败';
                        errorCode = 401;
                    }
                    callback(error, record);
                })
            },
            function(record, callback) {
                User.findOne({_id: record.userId }).populate('school').exec(function(err, user) {
                    if(err) {
                        console.error(err);
                        error = '数据库错误，请重试.';
                        errorCode = 500;
                    }
                    callback(error, user);
                })
            },
            function(user, callback) {
                var user_type = user.roles.indexOf('student') > -1 ? 'student': 'teacher';
                findRoom(user._id, user_type, function(err, room) {
                    if(err) {
                        console.error(err);
                        error = '数据库错误，请重试.';
                        errorCode = 500;
                    }
                    callback(error, user, user_type, room);
                })
            },
            function(user, user_type, room, callback) {
                getAllowedApps(function(err, allowedApps) {
                    if(err) {
                        error = '获取应用白名单失败，请重试.';
                        errorCode = 500;
                    }
                    var userInfo = {
                        user_avatar: null,
                        user_name: user.username,
                        user_account_type: user_type,
                        user_school: user.school.name,
                        user_birthday: user.birthday,
                        user_allowed_apps: allowedApps,
                        user_grade: user.grade,
                        user_class: room? room.name: '暂无班级',
                        user_password: user.school.launcherPassword
                    };
                    console.log(userInfo);
                    res.status(200).send({
                        status: 200,
                        user_info: userInfo
                    });
                    callback(error);
                })
            }
        ],
        function(err){
            if(err) {
                res.send({status: errorCode, message: err});
            }
        });
};



//
//    req.body.machine_id
//    req.body.os_type
//    req.body.os_version
//    req.body.name
//    req.body.user_type
//    req.body.school_id
//    req.body.grade
//    req.body.class

//
//console.log('hello world!');
//console.log(req.body.name);
//console.log(req.body.machine_id);
//
//User.findOne({username: req.body.name}).populate('school').exec(function(err, user) {
//    var deferred = Q.defer();
//    if(err) {
//        deferred.reject(err);
//    } else{
//        deferred.resolve(user);
//    }
//    return deferred.promise;
//}).then(function(user) {
//        var deferred = Q.defer();
//        if(!user) {
//            res.send({status: 401, message: "用户名" + req.body.name + "不存在" });
//        }else {
//            if(!_.contains(user.roles, req.body.user_type)) {
//                user.roles.push(req.body.user_type);
//                user.save(function(err){
//                    if(err) {
//                        console.error(err);
//                    }
//                })
//            }
//            // Update the tablet infomation in db, if not exist, create one.
//            Tablet.update({machine_id: req.body.machine_id},{machine_id: req.body.machine_id,OS_type: req.body.os_type, OS_version: req.body.os_version, school: user.school, lastUpdate: Date.now()},
//                {upsert: true},function(err, tablet){
//                    if(err){
//                        console.error(err);
//                        deferred.reject(err);
//                    }else {
//                        deferred.resolve(tablet);
//                    }
//                    return deferred.promise;
//                }).then(function(tablet) {
//                    Room.findOne({students: user._id, type: 'admin'}, function(err, room) {
//
//                    })
//
//
//                });
//        }
//    }, function(err) {
//        console.error(err);
//        res.send({status: 404, message: "数据库错误"});
//    }
//);

////req.query.access_token
//
//UserTablet.findOne({access_token: req.query.access_token}, function(err, record){
//    if (err) {
//        res.status(400).send({
//            status: 400,
//            message: errorHandler.getErrorMessage(err)
//        })
//    } else {
//        if(record) {
//            var userId = record.userId;
//            User.findOne({_id: userId }).populate('school').exec(function(err, user) {
//                if(err) {
//                    console.error(err);
//                    res.send({status: 500, message: "数据库错误, 请重试"});
//                }else {
//                    var user_type = user.roles.indexOf('student') > -1 ? 'student': 'teacher';
//                    console.log(user_type);
//                    findRoomPromise(user._id, user_type).then(function(room) {
//                        return [room, getAllowedAppsPromise()];
//                    }).spread(function(room, allowedApps) {
//                        var userInfo = {
//                            user_avatar: null,
//                            user_name: user.username,
//                            user_account_type: user_type,
//                            user_school: user.school.name,
//                            user_birthday: user.birthday,
//                            user_allowed_apps: allowedApps,
//                            user_grade: user.grade,
//                            user_class: room? room.name: '暂无班级',
//                            user_password: user.school.launcherPassword
//                        };
//                        console.log(userInfo);
//                        res.status(200).send({
//                            status: 200,
//                            user_info: userInfo
//                        });
//                    }, function(err) {
//                        console.error(err);
//                        res.status(500).send({status: 500,message: "获取应用程序白名单失败，请重试"});
//                    });
//
//                }
//            });
//        } else {
//            res.status(401).send({status: 401, message: "登录失败！"});
//        }
//    }
//});




//exports.tabletLogin = function(req,res) {
//    // Login, check if user exis    ts. If yes, login success, otherwise failed.
//    User.findOne({username: req.body.name}).populate('school').exec(function(err, user) {
//        if (err) {
//            console.error(err);
//            res.send({status: 500, message: "数据库错误"});
//        } else {
//            if (!user) {
//                res.status(404).send({message: "用户名" + req.body.name + "不存在"});
//            }
//            else {
//                if(!_.contains(user.roles, req.body.user_type)){
//                    user.roles.push(req.body.user_type);
//                    user.save(function(err){
//                        if(err) {
//                            console.error(err);
//                        }
//                    })
//                }
//                // Update the tablet infomation in db, if not exist, create one.
//                Tablet.update({machine_id: req.body.machine_id},{machine_id: req.body.machine_id,OS_type: req.body.os_type, OS_version: req.body.os_version, school: user.school, lastUpdate: Date.now()},
//                    {upsert: true},function(err){
//                        if(err){
//                            console.error(err);
//                            res.send({status: 500, message: "数据库错误"});
//                        }else {
//                            Tablet.findOne({machine_id: req.body.machine_id}, function(err, tablet) {
//                                if(err) {
//                                    console.error(err);
//                                    res.send({status: 500, message: "数据库错误"});
//                                }else {
//                                    UserTablet.findOne({userId: user._id, tabletId: tablet._id, logout_at: {$exists: false}}, function(err, record){
//                                        if(err){
//                                            res.send({status: 500, message: "数据库错误"});
//                                        }else{
//                                            if(record){
//                                                res.send( { status: 402, message: "你已经登录了该设备，请后台退出重试"});
//                                            }else {
//                                                UserTablet.findOne({userId: user._id, logout_at: {$exists: false}},function(err, anotherTablet){
//                                                    if(err){
//                                                        res.send({status: 500, message: "数据库错误"});
//                                                    }else{
//                                                        if(anotherTablet){
//                                                            res.send({status: 402, message: "错误：用户已登录到另一台设备上."});
//                                                        }else{
//                                                            UserTablet.findOne({tabletId: tablet._id, logout_at: {$exists: false}}).populate('userId').exec(function(err, anotherUser){
//                                                                if(err){
//                                                                    res.send({status:404, message:"数据库错误"});
//                                                                }else{
//                                                                    if(anotherUser){
//                                                                        console.log(anotherUser);
//                                                                        res.send({status: 403, message: "错误：另一个用户" + anotherUser.userId.name + "正在使用该设备，请先在后台登出"});
//                                                                    }else{
//                                                                        UserTablet.addRecord(user._id, tablet._id,function(err, newRecord) {
//                                                                            findRoomPromise(user._id, req.body.user_type).then(function(room) {
//                                                                               return [room, getAllowedAppsPromise()];
//                                                                            }).spread(function(room, allowedApps) {
//                                                                                var userInfo = {
//                                                                                    user_avatar: null,
//                                                                                    user_name: user.username,
//                                                                                    user_account_type: req.body.user_type,
//                                                                                    user_school: user.school.name,
//                                                                                    user_birthday: user.birthday,
//                                                                                    user_allowed_apps: allowedApps,
//                                                                                    user_grade: user.grade,
//                                                                                    user_class: room? room.name: '暂无班级',
//                                                                                    user_password: user.school.launcherPassword
//                                                                                };
//                                                                                console.log(userInfo);
//                                                                                res.status(200).send({
//                                                                                    status: 200,
//                                                                                    message: "登录成功！",
//                                                                                    access_token: newRecord.access_token,
//                                                                                    user_info: userInfo
//                                                                                });
//                                                                            }, function(err) {
//                                                                                            console.error(err);
//                                                                                            res.status(500).send({status: 500,message: "获取应用程序白名单失败，请重试"});
//                                                                            });
//                                                                        })
//                                                                    }
//                                                                }
//                                                            })
//                                                        }
//                                                    }
//                                                })
//                                            }
//                                        }
//                                    })
//                                }
//                            })
//                        }
//                    });
//            }
//        }
//    });
//};


