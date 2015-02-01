'use strict';

/**
 * Module dependencies.
 */
//var passport = require('passport');
var mongoose = require('mongoose');
var restify = require('express-restify-mongoose');
var multer = require('multer');
var File = mongoose.model('File');
var express = require('express');
var path = require('path');



module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');
	var rooms = require('../../app/controllers/rooms');
	var schools = require('../../app/controllers/schools');
	var records = require('../../app/controllers/records');
    var tablets = require('../../app/controllers/tablets');
	var apps = require('../../app/controllers/apps');
	var folders = require('../../app/controllers/folders');
	var files = require('../../app/controllers/files');
	var tabletLog = require('../../app/controllers/tabletLog');
	var feedbacks = require('../../app/controllers/feedbacks');
    var core = require('../../app/controllers/core');



	var multerMiddleware = multer({dest: __dirname+ '/../../upload/tmp'});
	var sunpackMiddleware = multer({dest: __dirname+ '/../../upload/tmp'});


    app.route('/').get(core.index);

    // Setting up the users profile api
    app.route('/me').get(users.me);
	app.route('/users').put(users.update);
	//app.route('/users/accounts').delete(users.removeOAuthProvider);


	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/password/reset').post(users.resetPassword);
	//app.route('/auth/forgot').post(users.forgot);
	//app.route('/auth/reset/:token').get(users.validateResetToken);
	//app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	//app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);


	/**
	 * create students
	 */
	app.route('/students/batch').post(users.requiresLogin, users.createStudentBatch);
	app.route('/students/auto').post(users.requiresLogin, users.autoCreateAddStudents);
	app.route('/students/manual').post(users.requiresLogin, users.manualCreateAddStudents);

	/**
	 *
	 */
	app.route('/rooms').post(users.requiresLogin, rooms.createRoom);
	app.route('/rooms/:roomId').delete(users.requiresLogin, rooms.removeRoom);
	app.route('/assign/apps').post(users.requiresLogin, rooms.assignApp);
	app.route('/assign/sunpack').post(users.requiresLogin, rooms.assignSunpack);


    /**
     * logout xiaoshu
     */
	app.route('/records/:userId/:tabletId').delete(users.requiresLogin, records.logout);
	app.route('/usertablet/count').get(users.requiresLogin, records.countBySchool);

	/**
	 * 	apk upload and download
	 */
	app.route('/upload/app/:appId').post(users.requiresLogin, multerMiddleware, apps.upload);
	app.route('/download/apks/:apkId').get(apps.downloadApk);
	app.route('/apks/get_updates').post(apps.getUpdate);

	/**
	 * Sunpack
	 */
    app.use('/sunpack/:fileId', users.requiresLogin, files.setContentType);
    app.use(express.static(path.resolve('./upload')));
    app.route('/upload/files/:folderId').post(users.requiresLogin,sunpackMiddleware, files.uploadFiles);
	app.route('/edit/file').post(users.requiresLogin, sunpackMiddleware, files.editFile);
	app.route('/delete/files/:fileId').put(users.requiresLogin, files.deleteFile);
    app.route('/files/:fileId').delete(users.requiresLogin, files.destroyFile);
    //app.route
	//app.route('/upload/file/:fileId').post(sunpackMiddleware, files.uploadFile);
	app.route('/download/files/:fileId').get(files.downloadFile);
	app.route('/repository').post(users.requiresLogin, sunpackMiddleware, files.uploadRepo);
	app.route('/folders/semester/:folderId').put(users.requiresLogin, folders.editFolder);
	app.route('/view/files/:fileId').get(users.requiresLogin, files.viewFile);
	app.route('/folders/room/:roomId').get(users.requiresLogin, folders.getFoldersByRoom);
	app.route('/folders/room/:roomId/teacher/:userId').get(users.requiresLogin, folders.getFoldersByRoomAndTeacher);
	app.route('/count/folders/room/:roomId/teacher/:userId').get(users.requiresLogin, folders.getFoldersCountByRoomAndTeacher);


	/**
	 * 	xiaoshu login
	 */
	app.route('/schools/get_all.json').get(tabletLog.getSchool);
	app.route('/machines/sign_in.json').post(tabletLog.tabletLogin);
	app.route('/machines/check_token').get(tabletLog.checkToken);

	//app.route('/feedbacks').post();

	//app.post('/users', user.requiresLogin, users.create);

	var userOptions = {
		strict: true,
		prefix: '',
		version: '',
		middleware: [users.requiresLogin],
		lowercase: true,
		access: users.userAccess,
		//findOneAndUpdate: false,
		findOneAndRemove: false,
		protected: "password,salt",
		private: "password,salt",
		//postProcess: users.userPostProcess,
		postDelete: users.deleteUser,
		fullErrors: true
	};


	var schoolOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
        middleware: [users.requiresLogin],
		access: users.schoolAccess,
		private: "launcherPassword",
		findOneAndUpdate: false,
		findOneAndRemove: false,
		postDelete: schools.deleteSchool,
		fullErrors: true

	};

	var roomOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
        middleware: [users.requiresLogin],
		//findOneAndUpdate: false,
		findOneAndRemove: false,
		fullErrors: true
	};
	var recordOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		middleware: [users.requiresLogin],
		findOneAndUpdate: false,
		findOneAndRemove: false,
		fullErrors: true
	};


	var tabletOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
        middleware: [users.requiresLogin],
		findOneAndUpdate: false,
		findOneAndRemove: false,
		fullErrors: true
	};

	var appOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
        middleware: [users.requiresLogin],
		findOneAndUpdate: false,
		findOneAndRemove: false,
		postDelete: apps.deleteApp,
		fullErrors: true
	};

	var folderOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
        middleware: [users.requiresLogin],
		//findOneAndUpdate: false,
		findOneAndRemove: false,
		postDelete: folders.deleteFolder,
		fullErrors: true
	};

	var fileOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
        middleware: [users.requiresLogin],
		//findOneAndUpdate: false,
		findOneAndRemove: false,
		//postDelete: files.deleteFile,
		fullErrors: true
	};

    var subjectOptions = {
        strict: true,
        prefix: '',
        version: '',
        lowercase: true,
        prereq: users.isRootRestify,
        findOneAndUpdate: false,
        findOneAndRemove: false,
        fullErrors: true
    };

    var semesterOptions = {
		strict: true,
		prefix: '',
		version: '',
		lowercase: true,
		prereq: users.isRootRestify,
        findOneAndUpdate: false,
		findOneAndRemove: false,
		fullErrors: true
	};

    var feedbackOptions = {
        postCreate: feedbacks.sendFeedbackMail,
        strict: true,
        prefix: '',
        version: ''
    };


	var UserModel = mongoose.model('User');
	var SchoolModel = mongoose.model('School');
	var RoomModel = mongoose.model('Room');
	var RecordModel = mongoose.model('Record');
	var SubjectModel = mongoose.model('Subject');
	var TabletModel = mongoose.model('Tablet');
	var AppModel = mongoose.model('App');
	var FolderModel = mongoose.model('Folder');
	var FileModel = mongoose.model('File');
	var SemesterModel = mongoose.model('Semester');
    var FeedbackModel = mongoose.model('Feedback');


    restify.serve(app, UserModel, userOptions);
	restify.serve(app, SchoolModel, schoolOptions);
	restify.serve(app, RoomModel, roomOptions);
	restify.serve(app, RecordModel, recordOptions);
	restify.serve(app, SubjectModel, subjectOptions);
	restify.serve(app, TabletModel, tabletOptions);
	restify.serve(app, AppModel, appOptions);
	restify.serve(app, FolderModel, folderOptions);
	restify.serve(app, FileModel, fileOptions);
	restify.serve(app, SemesterModel, semesterOptions);
    restify.serve(app, FeedbackModel, feedbackOptions);




    // Finish by binding the user middleware
	app.param('userId', users.getUserByID);
	app.param('roomId', rooms.getRoomById);
	app.param('schoolId', schools.getSchoolById);
	app.param('folderId', folders.getFolderById);
	app.param('fileId', files.getFileById);
    app.param('tabletId', tablets.getTabletById);




};
