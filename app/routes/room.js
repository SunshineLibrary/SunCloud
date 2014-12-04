'use strict';

module.exports = function(app) {
    var rooms = require('../../app/controllers/rooms');
    app.route('/assign/apps').put(rooms.assignApp);
};