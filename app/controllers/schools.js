'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors');
var School = mongoose.model('School');
var Room = mongoose.model('Room');
var User = mongoose.model('User');
var async = require('async');
var _ = require('underscore');

/**
 * Create a school
 */
exports.create = function(req, res) {
    var school = new School(req.body);

    school.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(school);
        }
    });
};

/**
 * Show the current school
 */
exports.read = function(req, res) {
    res.json(req.school);
};

/**
 * Update a school
 */
exports.update = function(req, res) {
    var school = req.school;

    school = _.extend(school, req.body);

    school.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(school);
        }
    });
};

/**
 * Delete an school
 */
exports.delete = function(req, res) {
    var school = req.school;

    school.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(school);
        }
    });
};
/**
 * After delete a school, also delete the rooms, teachers, students in the school.
 * @param res
 * @param result
 * @param done
 */
exports.deleteSchool = function(res, result, done) {
    var school = result[0];
    Room.find({school: school._id}, function(err, rooms) {
        if(err) {
            done(err);
        }
        if(rooms.length) {
            async.each(rooms, function(room, callback) {
                room.remove(function(err) {
                    if(err) {
                        callback(err);
                    }
                })
            }, function(err) {
                if(err) {
                    done(err);
                }
            });
        }
    });

    User.find({school: school._id}, function(err, users) {
        if(err) {
            done(err);
        }
        if(users.length) {
            async.each(users, function(user, callback) {
                user.remove(function(err) {
                    if(err) {
                        callback(err);
                    }
                })
            }, function(err) {
                if(err) {
                    done(err);
                }
            })
        }
    });
    done();
};


exports.getSchoolById = function (req, res, next, schoolId) {
    School.findOne(
        {"_id": schoolId},
        function (err, school) {
            if (err)return next(err);
            if (!school) return next(new Error('Failed to load School' + schoolId));
            school=JSON.parse(JSON.stringify(school));
            req.school = school;
            next();
        }
    );
};

exports.removeSchool = function (req, res) {
    School.removeSchool(req.school._id, function (err, school) {
        if (err) return res.json(500, err);
        res.json(school);
    });
};


