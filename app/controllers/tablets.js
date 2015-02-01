'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors');
var Tablet = mongoose.model('Tablet');
var _ = require('underscore');

/**
 * TODO:
 */

/**
 * Show the current tablet
 */
exports.read = function(req, res) {
    res.json(req.article);
};

/**
 * Article middleware
 */
exports.getTabletById = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Article is invalid'
        });
    }

    Tablet.findById(id).exec(function(err, tablet) {
        if (err) return next(err);
        if (!tablet) {
            return res.status(404).send({
                message: 'Tablet not found'
            });
        }
        req.tablet = tablet;
        next();
    });
};
/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};


/**
 * List of Tablets
 * TODO: list tablets in a specific class
 */
exports.list = function(req, res) {
    Tablet.find().populate('user', 'username').exec(function(err, tablets) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(tablets);
        }
    });
};




/**
 * Tablet middleware
 */
//exports.tabletByID = function(req, res, next, id) {
//    tablet.findById(id).populate('user', 'username').exec(function(err, tablet) {
//        if (err) return next(err);
//        if (!tablet) return next(new Error('Failed to load tablet ' + id));
//        req.tablet = tablet;
//        next();
//    });
//};

