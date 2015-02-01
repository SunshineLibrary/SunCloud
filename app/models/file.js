'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
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
    createBy: {
        type: String,
        enum:['root', 'admin', 'teacher'],
        default: 'teacher'
    },
    //createByRoot: {
    //    type: Boolean,
    //    default: false
    //},
    //createByAdmin: {
    //    type: Boolean,
    //    default: false
    //},
    shared: {
        type: Boolean,
        default: false
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
    updated_at: Date,
    deleted_at: Date
});

mongoose.model('File', FileSchema);
