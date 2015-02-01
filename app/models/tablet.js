'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TabletSchema = new Schema({
    machine_id: String,
    name: {
        type: String,
        required: true
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    },
    OS_type: String,
    OS_version: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    apps: [{
        type: Schema.Types.ObjectId,
        ref: 'App'
    }],
    lastUpdate: {
        type: Date
    },
    lockView: {
        locked: Boolean,
        unlockAfter: String
    },
    disableNetwork: {
        type: Boolean
    }
});

mongoose.model('Tablet', TabletSchema);
