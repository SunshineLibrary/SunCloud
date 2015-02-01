'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors');
var User = mongoose.model('User');
var Tablet = mongoose.model('Tablet');
var Record = mongoose.model('Record');
var _ = require('underscore');

exports.logout = function(req, res){
    Record.removeRecord(req.params.userId, req.params.tabletId,function(err,record){
        if(err){
            res.status(500).json(err);
        }
        res.status(200).json(record);

    })
};

exports.countBySchool = function(req, res) {
    Record.find({logout_at: null}).populate({
        path: 'userId',
        match: {school: req.query.schoolId}
    }).exec(function(err,records){
        if(err){
            res.json(500, err);
        }
        var count = 0;
        _.each(records, function(record){
            if(record.userId && _.contains(record.userId.roles, 'student')){
                count += 1;
            }
        });
        res.status(200).send({count: count});
    });

};


exports.getUserTabletById = function (req, res, next, userId) {
    Record.findOne(
        {"userId": userId},
        function (err, record) {
            if (err)return next(err);
            if (!record) return next(new Error('Failed to load Room' + userId));
            record= JSON.parse(JSON.stringify(record));
            req.record = record;
            next();
        }
    );
};
