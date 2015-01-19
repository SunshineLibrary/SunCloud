/**
 * Created by solomon on 14-6-28.
 */

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feedback = new Schema({
    user: Schema.Types.Mixed,
    content: String,
    pageInfo:{
        url:{ type: String, required: true }
    },
    contactInfo:{
        phone: String,
        email: String,
        qq: String
    },
    time: { type: Date, default: Date.now  },
    sendFail: {isFail:Boolean,reason:String}
});

mongoose.model('Feedback',Feedback);