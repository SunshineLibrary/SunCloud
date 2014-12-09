'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
var mongoose = require('mongoose');
var restify = require('express-restify-mongoose');
var multer = require('multer');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');
	var rooms = require('../../app/controllers/rooms');
	var schools = require('../../app/controllers/schools');
	var userTablets = require('../../app/controllers/userTablets');
	var apps = require('../../app/controllers/apps');
	var tabletLog = require('../../app/controllers/tabletLog');

	var multerMiddleware = multer({dest: __dirname+ '/../../upload/tmp'});

	// Setting up the users profile api
	app.route('/me').get(users.me);
	app.route('/users').put(users.update);
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);


	app.route('/rooms').post(users.restifyRoom, rooms.createRoom);
	app.route('/rooms/:id').delete(users.restifyRoom, rooms.removeRoom);
	app.route('/assign/apps').put(rooms.assignApp);


	app.route('/usertablet/').get(userTablets.logout);
	app.route('/usertablet/count').get(userTablets.countBySchool);

	//apk upload and download
	app.route('/upload/app/:appId').post(multerMiddleware, apps.upload);
	app.route('/download/apks/:apkId').get(apps.downloadApk);
	app.route('/apks/get_updates').post(apps.getUpdate);

	// xiaoshu login
	app.route('/schools/get_all.json').get(tabletLog.getSchool);
	app.route('/machines/sign_in.json').post(tabletLog.tabletLogin);
	app.route('/machines/check_token').get(tabletLog.checkToken);

	//app.post('/users', user.requiresLogin, users.create);

	var userOptions = {
		strict: true,
		prefix: '',
		version: '',
		middleware: [users.restifyUser],
		lowercase: true,
		access: users.userAccess,
		findOneAndUpdate: false,
		protected: "password,salt",
		private: "password,salt"
	};


	var schoolOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		middleware: [users.restifySchool],
		access: users.schoolAccess,
		private: "launcherPassword",
		findOneAndUpdate: false
	};

	var roomOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		middleware: [users.restifyRoom],
		findOneAndUpdate: true
	};
	var userTabletOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		middleware: [users.restifyUserTablet],
		findOneAndUpdate: false
	};

	var subjectOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		middleware: [users.restifySubject],
		findOneAndUpdate: false
	};

	var tabletOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		middleware: [users.restifyTablet],
		findOneAndUpdate: false
	};

	var appOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		middleware: [users.restifyApp]
		//findOneAndUpdate: false
	};

	var UserModel = mongoose.model('User');
	var SchoolModel = mongoose.model('School');
	var RoomModel = mongoose.model('Room');
	var UserTabletModel = mongoose.model('UserTablet');
	var SubjectModel = mongoose.model('Subject');
	var TabletModel = mongoose.model('Tablet');
	var AppModel = mongoose.model('App');


	restify.serve(app, UserModel, userOptions);
	restify.serve(app, SchoolModel, schoolOptions);
	restify.serve(app, RoomModel, roomOptions);
	restify.serve(app, UserTabletModel, userTabletOptions);
	restify.serve(app, SubjectModel, subjectOptions);
	restify.serve(app, TabletModel, tabletOptions);
	restify.serve(app, AppModel, appOptions);


	// Finish by binding the user middleware
	app.param('userId', users.userByID);
	app.param('roomId', rooms.getRoomById);
	app.param('schoolId', schools.getSchoolById);



};
