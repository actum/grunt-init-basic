/*
 * grunt-init-basic
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, Jan Panschab, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Nodejs libs.
var path = require('path');

// Basic template description.
exports.description = 'Create a basic project inculde Stylus, RequireJS and jQuery.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ should be a unique ID. _Project ' +
    'title_ should be a human-readable title.';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
    'install && bower install_. After that, you may execute project tasks with _grunt_. ' +
    'For more information about installing and configuring Grunt, please see ' +
    'the Getting Started guide:' +
    '\n\n' +
    'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

    init.process({
        type: 'basic'
    }, [
        // Prompt for these values.
        init.prompt('name'),
        init.prompt('title', function(value, data, done) {
            done(null, value);
        }),
        init.prompt('description', 'Best project ever.'),
        init.prompt('version'),
        init.prompt('repository', function(value, data, done) {
            done(null, 'git://github.com/actum/' + data.name + '.git');
        }),
        init.prompt('homepage', function(value, data, done) {
            done(null, 'http://www.' + data.name + '.cz/');
        }),
        init.prompt('bugs'),
        init.prompt('licenses', 'MIT'),
        init.prompt('author_name', 'Actum'),
        init.prompt('author_email', 'actum@actum.cz'),
        init.prompt('author_url', 'http://www.actum.cz/')
    ], function(err, props) {
        // A few additional properties.
        props.basicjson = props.name + '.json';

        props.keywords = [];

        // Files to copy (and process).
        var files = init.filesToCopy(props);

        // Add properly-named license files.
        init.addLicenseFiles(files, props.licenses);

        // Actually copy (and process) files.
        init.copyAndProcess(files, props, {
            noProcess: 'libs/**'
        });

        // Generate package.json file, used by npm and grunt.
        init.writePackageJSON('package.json', {
            name: 'basic-project',
            version: '0.0.0-ignored',
            // TODO: pull from grunt's package.json
            node_version: '>= 0.8.0',
            devDependencies: {
                'grunt-contrib-stylus': '~0.5.0',
                'grunt-contrib-csslint': '~0.1.2',
                'grunt-contrib-cssmin': '~0.6.1',
                'grunt-contrib-concat': '~0.1.3',
                'grunt-jsvalidate': '~0.2.1',
                'grunt-contrib-jshint': '~0.1.1',
                'grunt-contrib-watch': '~0.4.4',
                'grunt-requirejs': '~0.3.5',
                'grunt-contrib-handlebars': '~0.5.8',
                'grunt-contrib-imagemin': '~0.1.4',
                'grunt-contrib-clean': '~0.4.1',
                'grunt': '~0.4.1'
            },
        });

        // Generate project.json file.
        init.writePackageJSON(props.basicjson, props, function(pkg, props) {
            return pkg;
        });

        // All done!
        done();
    });

};