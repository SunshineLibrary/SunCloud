'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FolderSchema = new Schema({
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
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }],
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
});

mongoose.model('Folder', FolderSchema);
