'use strict';

module.exports = {
	app: {
		title: '阳光书屋|信息化教育平台',
		description: '阳光书屋',
		keywords: '阳光书屋'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/bower/bootstrap/dist/css/bootstrap.css',
				'public/lib/flat-ui-pro/dist/css/flat-ui-pro.css',
				'public/lib/bower/flat-ui-pro/docs/assets/css/docs.css',
				'public/lib/bower/ng-grid/ng-grid.css',
				'public/lib/bower/sweetalert/lib/sweet-alert.css',
				'public/lib/bower/font-awesome/css/font-awesome.css'
			],
			js: [
				//'public/lib/bower/ng-file-upload/angular-file-upload-shim.js',
				'public/lib/bower/angular/angular.js',
				'public/lib/bower/angular-resource/angular-resource.js',
				'public/lib/bower/angular-animate/angular-animate.js',
				'public/lib/bower/angular-ui-router/release/angular-ui-router.js',
				'public/lib/bower/angular-ui-utils/ui-utils.js',
				'public/lib/bower/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/bower/jquery/dist/jquery.min.js',
				'public/lib/bower/underscore/underscore-min.js',
				'public/lib/bower/ng-grid/ng-grid-2.0.14.min.js',
				'public/lib/bower/moment/moment.js',
				'public/lib/bower/angular-moment/angular-moment.js',
				'public/lib/bower/moment/locale/zh-cn.js',
				//'public/lib/bower/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/bower/sweetalert/lib/sweet-alert.min.js',
				'public/lib/bower/angular-file-upload/angular-file-upload.js',
				'public/lib/bower/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
				'public/lib/bower/async/lib/async.js',
				'public/lib/flat-ui-pro/dist/js/flat-ui-pro.js',
				'public/lib/bower/angular-breadcrumb/dist/angular-breadcrumb.js',
				'public/lib/bower/d3/d3.js',
				'public/lib/bower/videojs/dist/video-js/video.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/bower/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
