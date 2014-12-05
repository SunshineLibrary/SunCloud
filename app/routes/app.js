'use strict';

module.exports = function(app) {
    // Root routing
    var apps = require('../../app/controllers/apps');
    var multer = require('multer');
    var multerMiddleware = multer({dest: __dirname+ '/../../upload/tmp'});

    app.route('/upload/app/:appId').post(multerMiddleware, apps.upload);
    app.route('/download/apks/:apkId').get(apps.downloadApk);
    app.route('/apks/get_updates').post(apps.getUpdate);
};