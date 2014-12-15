'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../config/config');
var classCodeCtl = require('../controllers/classCodes.js');
var classCodeModel = mongoose.model('ClassCode');

var validateRoomName = function(name) {
    var Room = mongoose.model('Room');
    console.log('~~~~~~~~~~validate name');
    Room.findOne({name: this.name, school: this.school}, function(err, room) {
        if(err) {
            return false;
        }else if(room) {
            console.log('name must be unique within a school');
            return false;
        }else {
            return true;
        }
    })
};

var validateRoomCode = function(code) {
    var Room = mongoose.model('Room');
    console.log('~~~~~~~~~~validate name');


    Room.findOne({code: this.code, school: this.school}, function(err, room) {
        if(err) {
            return false;
        }else if(room) {
            console.log('name must be unique within a school');
            return false;
        }else {
            return true;
        }
    })
};
var RoomSchema = new Schema({
        _id: { type: Schema.Types.ObjectId,
            index: true,
            default: function () {
                return new mongoose.Types.ObjectId
            }
        },
        name: {
            type: String,
            required: true
            //validate: [validateRoomName, '已经存在此班级名， 请修改班级名后重试']
        },
        classCode: {
            //This is the Code of the classroom.
            // Students can join this classroom with inputting this Code.
            type: String
        },
        grade: String,
        type: {
            type: String,
            enum: ['admin', 'teaching']
        },
        code: {
            type: String
            //validate: [validateRoomCode, '已经存在此班级编号， 请修改班级名后重试']
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: 'School',
            required: true
        },
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                index: true
            }
        ],
        teachers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                index: true
            }
        ],
        apps: [
            {
            type: Schema.Types.ObjectId,
            ref: 'App'
            }
        ],
        installation: [{
            app: {
                type: Schema.Types.ObjectId,
                ref: 'App'
            },
            version: Number,
            student: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
        sunpack: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Folder'
            }
        ],
        download: [{
            folder: {
                type: Schema.Types.ObjectId,
                ref: 'Folder'
            },
            student: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    } ,{ strict: true }
);





RoomSchema.statics.createRoom = function (roomInfo, callBack) {
    var thisModel = this;
    classCodeCtl.createClassCode(function (err, classCode) {
        if (err) {
            console.log(err.message + JSON.stringify(roomInfo));
            return callBack(err);
        } else {
            roomInfo.classCode = classCode;
            var room = new thisModel(roomInfo);
            room.save(function (err) {
                if (err) {
                    console.log(err.message + JSON.stringify(roomInfo));
                    return callBack(err);
                } else {
                    return callBack(err, room);
                }
            });
        }
    });
};

RoomSchema.statics.removeRoom = function (roomInfo, callBack) {
    var thisModel = this;
    thisModel.find(roomInfo, {'_id': true, 'classCode': true}, function (err, rooms) {
        if (err) {
            console.log(err.message + JSON.stringify(roomInfo));
            return callBack(err);
        } else {
            var classCodes = [];
            for (var roomsIndex = 0; roomsIndex < rooms.length; roomsIndex++) {
                classCodes.push(rooms[roomsIndex].classCode);
            }
            classCodeModel.deleteClassCode(classCodes, function (err) {
                if (err) {
                    console.log(err.message + JSON.stringify(roomInfo));
                    return callBack(err);
                } else {
                    thisModel.remove(roomInfo, callBack);
                }
            });
        }
    });
};

//RoomSchema.pre('save', )

RoomSchema.path('name').validate(function(value, respond) {
    var Room = mongoose.model('Room');
    console.log('~~~~~~~~~~validate name');


    return Room.findOne({_id: {$ne: this._id} ,name: this.name, school: this.school}, function(err, room) {
        if(err) {
            respond(false);
        }else if(room) {
            console.log('name must be unique within a school');
            respond(false);
        }else {
            respond(true);
        }
    })
}, '已经存在此班级名， 请修改班级名后重试');

RoomSchema.path('code').validate(function(value, respond) {
    console.log('~~~~~~~~~~validate code', value);
    var Room = mongoose.model('Room');

    return Room.findOne({_id: {$ne: this._id}, code: this.code, school: this.school}, function(err, room) {
        if(err) {
            respond(false);
        }else if(room) {
            console.log('code must be unique within a school');
            respond(false);
        }else {
            respond(true);
        }
    })
}, '已存在此班级编号， 请修改后重试');


RoomSchema.pre('save', function(next) {
    console.log('~~~~~~~~~~');
    var Room = mongoose.model('Room');
    Room.findOne({_id: {$ne: this._id}, code: this.code, school: this.school}, function(err, room) {
        if(err) {
            next(err);
        }else if(room) {
            next('code must be unique')
        }else {
            next();
        }
    });

    Room.findOne({_id: {$ne: this._id}, name: this.name, school: this.school}, function(err, room) {
        if(err) {
            next(err);
        }else if(room) {
            console.log('name must be unique within a school');
            next('name must be unique within a school');
        }else {
            next();
        }
    });
    next();
});

mongoose.model('Room', RoomSchema);
