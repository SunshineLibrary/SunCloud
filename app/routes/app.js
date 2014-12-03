'use strict';

module.exports = function(app) {
    // Root routing
    var apps = require('../../app/controllers/apps');

    app.route('/download/apks/:apkId').get(apps.downloadApk);
    app.route('/apks/get_updates').post(apps.getUpdate);
    ///apks/get_updates?access_token=
};