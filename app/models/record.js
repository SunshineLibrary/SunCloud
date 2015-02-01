'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
//var User = mongoose.model('User');

var Schema = mongoose.Schema;

var recordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tabletId: {
        type: Schema.Types.ObjectId,
        ref: 'Tablet'
    },
    access_token: String,
    logout_at: Date,
    login_at: Date,
    update_at: Date

});


var calculateAccessToken = function(userId,tabletId){

    var salt = "sunbookistheelevatorfortheadvancementofusruralkids";
    var str = tabletId.toString() + ';' + userId.toString() + ';' + Date.now().toString();
    return crypto.createHmac('sha1', salt).update(str).digest('hex');

};


recordSchema.statics.addRecord = function(userId, tabletId,callBack){
    var newRecord = {
        access_token: calculateAccessToken(userId, tabletId),
        userId: userId,
        tabletId: tabletId,
        login_at: Date.now(),
        update_at: Date.now()
    };

    var record = new this(newRecord);

    record.save(function(err){
        if (err) {
            console.log(err.message + JSON.stringify(newRecord));
            return callBack(err);
        } else {
            return callBack(err, record);
        }
    });
};

recordSchema.statics.removeRecord = function(userId, tabletId,callBack){
    this.findOneAndUpdate({userId: userId, tabletId: tabletId, logout_at: null}, {access_token: null, logout_at: Date.now()}, callBack);
    //this.findOneAndRemove({userId: userId, tabletId: tabletId}, function(err, record){
    //    if(err){
    //        console.error(err);
    //        return callBack(err);
    //    }else{
    //        if(record){
    //            User.findOneAndUpdate({_id: userId},{$push:{xiaoshuHistory: {tablet: tabletId, logoutTime: Date.now()}} }, function(err, user){
    //                if(err){
    //                    console.error(err);
    //                    return callBack(err);
    //                }
    //            });
    //            return callBack(err, record);
    //        }
    //    }
    //})
};

mongoose.model('Record', recordSchema);
