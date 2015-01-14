'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
    _id: { type: Schema.Types.ObjectId,
        index: true,
        default: function () {
            return new mongoose.Types.ObjectId
        }
    },
    name: {
        type: String,
        required: true
    },
    originalname: {
        type: String
    },
    description: String,
    path: String,
    size: Number,
    type: {
        type: String
    },
    extension: String,
    encoding: String,
    mimetype: String,
    truncated: Boolean,
    buffer: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    semester: {
        type: Schema.Types.ObjectId,
        ref: 'Semester'
    },
    shared: {
        type: Boolean,
        default: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    created_at: Date,
    updated_at: Date
});

mongoose.model('File', FileSchema);
