'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('underscore'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 5));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    _id: { type: Schema.Types.ObjectId,
        index: true,
        default: function () {
            return new mongoose.Types.ObjectId
        }
    },
	username: {
		type: String,
		unique: 'username unique',
		required: '请输入用户名',
		trim: true
	},
	name: {
		type: String,
		trim: true
	},
	password: {
		type: String,
		default: 'xiaoshu',
		validate: [validateLocalStrategyPassword, '密码太短啦']
	},
	resetPassword: {
		type: Boolean,
		default: false
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		default: 'local'
		//required: 'Provider is required'
	},
	roles: {
		type: [{
			type: String,
			enum: ['student','teacher', 'admin','root']
		}],
		default:[]
	},
	subjects: [{
		type: Schema.Types.ObjectId,
		ref: 'Subject'
	}],
	apps: [{
		type: Schema.Types.ObjectId,
		ref: 'App'
	}],
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
  	resetPasswordExpires: {
  		type: Date
  	},
    gender: {
        type: String,
        enum: ['male','female']
    },
	//school: String,
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    },
	grade: Number,
	birthday: String,
	email: {
		type: String,
		trim: true,
		default: '',
		//validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, '电子邮箱格式不正确']
	},
	phone: {
		type: String,
		trim: true,
		match: [/^\d{7,}$/, '电话号码格式不正确']
	},
	canCreateApp: {
		type: Boolean,
		default: false
	},
	canAssignApp: {
		type: Boolean,
		default: true
	}
});


/**
 * Basic info to identify the current authenticated user in the app
 */
UserSchema.virtual('profile').get(function () {
	return {
		'_id': this._id,
		'name': this.name,
		'username': this.username,
		'email': this.email,
		'phone': this.phone,
		'school': this.school,
		'gender': this.gender,
		'grade': this.grade,
		'roles': this.roles,
		'subjects': this.subjects
	};
});


/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	console.info('pre save~~~~~');
	if (this.password && this.password.length > 5) {
		console.info('pre save------');

		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

UserSchema.pre('remove', function(next) {
	console.log('------pre remove');
	var Room = mongoose.model('Room');
	var thisUserId = this._id;
	Room.find({students: thisUserId}, function(err, rooms) {
		if(err) {
			next(err);
		}else {
			if(rooms.length) {
				_.each(rooms, function(room) {
					room.students = _.reject(room.students, function(student) {
						return student === thisUserId;
					});
					room.save(function(err) {
						next(err);
					})
				})
			}
			next();
		}
	})
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);
