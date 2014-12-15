'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppSchema = new Schema({
    _id: { type: Schema.Types.ObjectId,
        index: true,
        default: function () {
            return new mongoose.Types.ObjectId
        }
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    //versionCode: Number,
    //versionName: String,
    file_path: String,
    package: String,
    apks: [{
        versionCode: Number,
        versionName: String,
        package: String,
        fileName: String,
        size: Number,
        id: Number,
        created_at: Date
    }],
    status: {
        type: String,
        enum: ['release', 'test']
    },
    updated_at: Date,
    uuid: String,
    ts: Number,
    id: Number,
    whats_new: String,
    icon: {
        type: String
    },
    url: {
        type: String
    },
    disableNetwork: {
        type: Boolean

    },
    default_installed: {
        type: Boolean,
        default: false
    } ,
    create_by: {
        type: String,
        enum:['root', 'admin', 'teacher']
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shared: {
        type: Boolean,
        default: true
    }
    //created_at: Date,
    //deleted_at: Date,
    //file_content_type: String,
    //file_file_name: String,
    //file_file_size: Number,
    //file_updated_at: Date,
    //file_name: String,
});

mongoose.model('App', AppSchema);
