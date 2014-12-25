'use strict';

/**
 * Module dependencies.
 */
var _ = require('underscore'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Room = mongoose.model('Room'),
    School = mongoose.model('School');

var async = require('async');


/**
 * Create user for sign up
 */
exports.create = function(req, res, next) {
    var user = new User(req.body);
    var message = null;

    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = '用户名已存在';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }
            return res.send(400, {
                message: message
            });
        } else if ((req.user) && (req.user.roles.indexOf('root') >= 0)) {
            res.json(200, user);
        } else {
            //{username: xxx, hashed_password:xxx, have_profile}
            var response = {
                _id:user._id,
                username: user.username
            };
            //TODO: modify the usernmae mechanism
            if (user.email) {
                response.email = user.email;
            } else if (user.phone) {
                response.phone = user.phone;
            }

            if (req.query && req.query.isTemp) {
                req.logout();
                req.login(user, function(err) {
                    if (err) return res.send(500, "temp user login new create user err");
                    return res.json(200, req.user);
                })
            } else {
                res.json(200, response);
            }
        }
    });
};


exports.createStudentBatch = function(req, res) {
  var studentsList = req.body.studentsList;
    console.log(studentsList);
    var successList = [];
    async.reject(studentsList, function(student, callback) {
        var newStudent = new User(student);
        newStudent.created_at = Date.now();
        newStudent.save(function(err) {
            if(err) {
                callback(false);
            }else {
                newStudent.salt = null;
                newStudent.password = null;
                successList.push(newStudent);
                callback(true);
            }
        })

    }, function(failedStudents) {
        if(failedStudents.length) {
            res.status(406).send(failedStudents);
        }else {
            res.status(200).send(successList);
        }

    });
};

exports.autoCreateAddStudents = function(req, res) {
    var names = req.body.names;
    var schoolId = req.body.schoolId;
    var roomId = req.body.roomId;

    School.findById(schoolId, function(err, school) {
        if(err) {
            res.status(500).send({message: '服务器错误，未找到学校'});
        }
        if(school) {
            Room.findById(roomId, function(err, room) {
                if(err) {
                    res.status(500).send({message: '服务器错误，未找到该班级'});
                }
                if(room) {
                    var index = room.studentIndex || 0;
                    var successList = [];
                    async.rejectSeries(names, function(name, callback) {
                        index = index + 1;
                        var student = new User();
                        var studentNo = (index > 9) ? ''+index : '0' + index;
                        student.name = name;
                        student.username = school.code + room.code + studentNo;
                        student.roles = ['student'];
                        student.school = school._id;
                        student.created_at = Date.now();
                        student.save(function(err) {
                            if(err){
                                callback(false);
                            }else {
                                successList.push(student);
                                callback(true);
                            }
                        })
                    }, function(failList) {
                        if(failList.length) {
                            console.log(failList);
                            res.status(406).send(failList);
                        }else {
                            room.students = room.students.concat(successList);
                            room.studentIndex = index;
                            room.save(function(err) {
                                if(err) {
                                    res.status(500).send({message: '学生添加到班级失败'})
                                }else {
                                    res.status(200).send(successList);
                                }
                            });
                        }
                    })
                }else {
                    res.status(404).send({message: '不存在此班级'});
                }
            });
        }else {
            res.status(404).send({message: '不存在此学校'});
        }
    })
};

exports.manualCreateAddStudents = function(req, res) {
    var students = req.body.students;
    var schoolId = req.body.schoolId;
    var roomId = req.body.roomId;
    var successList = [];
    async.reject(students, function(student, callback) {
        var user = new User();
        user.name = student.name;
        user.username = student.username;
        user.school = schoolId;
        user.roles = ['student'];
        user.created_at = Date.now();
        user.save(function(err) {
            if(err) {
                console.log(err);
                callback(false);
            }else {
                successList.push(user);
                callback(true);
            }
        })
    }, function(failList) {
        if(failList.length) {
            res.status(406).send(failList);
        }else {
            Room.findById(roomId, function(err, room) {
                if(err) {
                    res.status(500).send('服务器错误');
                }
                if(room) {
                    room.students = room.students.concat(successList);
                    room.save(function(err) {
                        if(err) {
                            res.status(500).send({message: '学生添加到班级失败'})
                        }else {
                            res.status(200).send(successList);
                        }
                    });

                }else {
                    res.status(404).send({message: '不存在此班级'});
                }
            })
        }
    })




};
