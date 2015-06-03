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
var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
	if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
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
                sunshine._id = mongoose.Types.ObjectId('000000000000000000000000');
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
                            root.password = 'xiaoshu815';
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

mongoose.connection.on('error', function(err) {
        console.error(chalk.red('MongoDB connection error: ' + err));
        process.exit(-1);
    }
);


// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('--');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db.uri));
if (process.env.NODE_ENV === 'secure') {
	console.log(chalk.green('HTTPs:\t\t\t\ton'));
}
console.log('--');