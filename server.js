'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}else {
        /**
         * create SunshineLibrary root account if not exists
         * @type {*|Model}
         */
        var School = mongoose.model('School');
        var User = mongoose.model('User');
        School.findOne({}, function(err, school) {
            if(err) {
                console.error(err);
            }else if(!school) {
                var sunshine = new School();
                sunshine.name = '阳光书屋';
                sunshine.code = 'sun';
                sunshine.address = '北京';
                sunshine.save(function(err) {
                    if(err) {
                        console.error(err);
                    }
                    User.findOne({username: 'root'}, function(err, user) {
                        if(err) {
                            console.error(err);
                        }else if(!user) {
                            var root = new User();
                            root.username = 'root';
                            root.name = '阳光书屋';
                            root.password = 'xiaoshu';
                            root.roles = ['root', 'admin'];
                            root.school = sunshine._id;
                            root.save(function(err) {
                                if(err) {
                                    console.error(err);
                                }
                            });
                        }
                    });
                });

            }
        });
    }
});



// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
module.exports = app;

// Logging initialization
console.log('SunCloud application started on port ' + config.port);


// Logging initialization
console.log('--');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db));
if (process.env.NODE_ENV === 'secure') {
	console.log(chalk.green('HTTPs:\t\t\t\ton'));
}
console.log('--');