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
    path: String,
    size: Number,
    type: {
        type: String
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
    shared: Boolean,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

mongoose.model('File', FileSchema);
