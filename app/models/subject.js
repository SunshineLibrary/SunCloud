'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubjectSchema = new Schema({
    _id: { type: Schema.Types.ObjectId,
        index: true,
        default: function () {
            return new mongoose.Types.ObjectId
        }
    },
    name: {
        type: String,
        //unique: true,
        required: true
        //enum:['语文', '数学', '英语', '历史', '地理', '物理', '化学','阳光书屋', '其他']
    },
    EnglishName: {
        type: String
    },
    chapter: {

    }

});

/**
 * Hook a pre save method to
 */
SubjectSchema.pre('save', function(next) {
    switch(this.name) {
        case '语文':
            this.EnglishName = 'Chinese';
            break;
        case '数学':
            this.EnglishName = 'Math';
            break;
        case '英语':
            this.EnglishName = 'English';
            break;
        case '历史':
            this.EnglishName = 'History';
            break;
        case '地理':
            this.EnglishName = 'Geography';
            break;
        case '物理':
            this.EnglishName = 'Physics';
            break;
        case '阳光书屋':
            this.EnglishName = 'SunshineLibrary';
            break;
        case '其他':
            this.EnglishName = 'Others';
            break;
        default:
            next('科目不存在');
    }
    next();
});

mongoose.model('Subject', SubjectSchema);
