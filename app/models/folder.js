'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    semester: {
        type: Schema.Types.ObjectId,
        ref: 'Semester'
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }],
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
});

mongoose.model('Folder', FolderSchema);
