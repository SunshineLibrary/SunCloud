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
				'public/lib/bootstrap/dist/css/bootstrap.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/flat-ui-pro/dist/css/flat-ui-pro.css',
				'public/lib/flat-ui-pro/docs/assets/css/docs.css',
                'public/lib/angular-ui-grid/ui-grid.css',
				'public/lib/ng-grid/ng-grid.css',
				'public/lib/sweetalert/lib/sweet-alert.css',
				'public/lib/font-awesome/css/font-awesome.css',
				//'public/lib/css-toggle-switch/dist/toggle-switch.css',
				'public/lib/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css'
				//'public/lib/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css'
			],
			js: [
				//'public/lib/ng-file-upload/angular-file-upload-shim.js',
				'public/lib/angular/angular.js',
				//'bower_components/angular/angular.js',
				'public/lib/angular-route/angular-route.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/js/datepickerzh.js',
				'public/lib/underscore/underscore-min.js',
				//'cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore.js',
				'public/lib/angular-ui-grid/ui-grid.js',
				'public/lib/ng-grid/ng-grid-2.0.13.min.js',
				'public/lib/moment/moment.js',
				'public/lib/angular-moment/angular-moment.js',
				'public/lib/moment/locale/zh-cn.js',
				//'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/sweetalert/lib/sweet-alert.min.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/checklist-model/checklist-model.js',
				'public/lib/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
				'public/lib/async/lib/async.js',
				'public/lib/flat-ui-pro/dist/js/flat-ui-pro.js',
				'public/lib/flat-ui-pro/docs/assets/js/application.js',
				'public/lib/bootstrap-switch/dist/js/bootstrap-switch.js',
				'public/lib/angular-breadcrumb/dist/angular-breadcrumb.js',
				'public/lib/d3.js',
				'public/lib/pdfjs/build/generic/build/pdf.js',
				'public/lib/pdfjs/build/generic/web/compatibility.js',
				'public/lib/jquery-timeago/jquery.timeago.js',
				'public/lib/jquery-timeago/locales/jquery.timeago.zh-CN.js'

				//'public/lib/smart-time-ago/lib/timeago.js',
				//'public/lib/smart-time-ago/lib/locales/timeago.zh-cn.js'



				//'public/lib/angular-bootstrap-switch/dist/angular-bootstrap-switch.js',
				//'public/lib/angular-bootstrap-switch/src/directives/bsSwitch.js'
                //



				//'http://d3js.org/d3.v3.min.js" charset="utf-8"'


//'public/lib/ng-file-upload/angular-file-upload.js'




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
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
