'use strict';

/**
 * Module dependencies.
 */
var _ = require('underscore'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * After delete a student or teacher, also need to delete user in room.
 * @param req
 * @param res
 */
exports.userPostProcess = function(req, res) {
    if(req.route.path === '/users/:id' && req.method === 'DELETE') {
        var userId = req.params.id;
        var Room = mongoose.model('Room');
        Room.find({students: userId}, function(err, rooms) {
            if(err) {
                console.error(err);
            }else {
                if(rooms.length) {
                    _.each(rooms, function(room) {
                        room.students = _.reject(room.students, function(student) {
                            return student.toString() === userId.toString();
                        });
                        room.save(function(err) {
                            if(err) {
                                console.error(err);
                            }
                        })
                    })
                }
            }
        })
    }

};

exports.deleteUser = function(res, result, done) {
    var user = result[0];
    var Room = mongoose.model('Room');
    var query = {};
    var role;
    if(user.roles.indexOf('student') > -1) {
        role = 'students';
    }
    if(user.roles.indexOf('teacher') > -1 ) {
        role = 'teachers';
    }
    query[role] = user._id;
    if(role) {
        Room.find(query, function(err, rooms) {
            if(err) {
                console.error(err);
                done(err);
            }else {
                if(rooms.length) {
                    async.each(rooms, function(room, callback) {
                        room[role] = _.reject(room[role], function(theUser) {
                            return theUser.toString() === user._id.toString();
                        });
                        room.save(function(err) {
                            if(err) {
                                console.error(err);
                                callback(err);
                            }
                        })
                    }, function(err) {
                        if(err) {
                            done(err);
                        }
                    })
                }
            }
        })
    }
    done();
};
