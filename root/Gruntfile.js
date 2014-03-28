'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('{%= basicjson %}'),
        // global
        documentRoot: 'www',
        bower: 'bower_components',
        // css
        css: '<%= documentRoot %>/css',
        cssFile: '<%= css %>/style.css',
        lessRoot: '<%= css %>/main.less',
        // img
        img: '<%= documentRoot %>/img',
        // js
        js: '<%= documentRoot %>/js',
        app: '<%= js %>/app',
        appCompiled: '<%= js %>/app-compiled.js',
        // templates
        tpl: '<%= documentRoot %>/tpl',
        // dist
        dist: 'dist',
        // Task configuration.
        less: {
            options: {
                paths: [
                    '<%= css %>',
                    '<%= bower %>'
                ],
                relativeUrls: true
            },
            dev: {
                options: {
                    sourceMap: true,
                    sourceMapFilename: '<%= css %>/style.css.map',
                    sourceMapURL: 'style.css.map',
                    sourceMapBasepath: '<%= documentRoot %>',
                    outputSourceFiles: true
                },
                files: {
                    '<%= cssFile %>': '<%= lessRoot %>'
                }
            },
            production: {
                options: {
                    cleancss: true,
                    report: 'min'
                },
                files: {
                    '<%= cssFile %>': '<%= lessRoot %>'
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: false,
                    commonjs: true,
                    processName: function(filePath) {
                        var pieces = filePath.split('/');
                        return pieces[pieces.length - 1];
                    }
                },
                files: [{
                    expand: true,
                    src: ['<%= app %>/**/*.hbs'],
                    dest: '',
                    ext: '.hbs.js'
                }]
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            dev: {
                options: {
                    jshintrc: '<%= app %>/.jshintrc-dev'
                },
                src: [
                    '<%= app %>/**/*.js',
                    '!<%= app %>/**/*.hbs.js'
                ]
            },
            production: {
                options: {
                    jshintrc: '<%= app %>/.jshintrc'
                },
                src: [
                    '<%= app %>/**/*.js',
                    '!<%= app %>/**/*.hbs.js'
                ]
            }
        },
        imagemin: {
            production: {
                options: {
                    optimizationLevel: 3,
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= img %>',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: '<%= img %>',
                        ext: ''
                    }
                ]
            }
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: [
                '<%= app %>/**/*.js',
                '!<%= app %>/**/*.hbs.js'
            ]
        },
        browserify: {
            options: {
                shim: {
                    jquery: { path: '<%= bower %>/jquery/jquery.js', exports: 'window.jQuery' },
                    handlebars: { path: 'node_modules/grunt-contrib-handlebars/node_modules/handlebars/dist/handlebars.runtime.js', exports: 'Handlebars' }
                }
            },
            dev: {
                options: {
                    debug: true
                },
                files: {
                    '<%= appCompiled %>': ['<%= app %>/app.js']
                }
            },
            production: {
                files: {
                    '<%= appCompiled %>': ['<%= app %>/app.js']
                }
            }
        },
        uglify: {
            options: {
                report: 'min'
            },
            compile: {
                files: {
                    '<%= js %>/app-compiled.min.js': ['<%= appCompiled %>']
                }
            }
        },
        clean: {
            production: ['<%= dist %>'],
            tpl: ['<%= documentRoot %>/*.html']
        },
        copy: {
            options: {
                nonull: true
            },
            js: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%= bower %>/html5shiv/dist/html5shiv-printshiv.js'],
                    dest: '<%= js %>'
                }]
            },
            production: {
                files: [{
                    expand: true,
                    cwd: 'www',
                    src: [
                        'css/style.css',
                        'js/*.js',
                        'img/**/*',
                        '*.html'
                    ],
                    dest: '<%= dist %>'
                }]
            }
        },
        assemble: {
            options: {
                pkg: '<%= pkg %>',
                flatten: true
            },
            dev: {
                options: {
                    data: '<%= tpl %>/dev/*.json',
                    partials: ['<%= tpl %>/partials/**/*.hbs'],
                    layout: '<%= tpl %>/layouts/default.hbs'
                },
                files: {
                    '<%= documentRoot %>': ['<%= tpl %>/pages/**/*.hbs']
                }
            },
            production: {
                options: {
                    data: '<%= tpl %>/production/*.json',
                    partials: ['<%= tpl %>/partials/**/*.hbs'],
                    layout: '<%= tpl %>/layouts/default.hbs'
                },
                files: {
                    '<%= documentRoot %>': ['<%= tpl %>/pages/**/*.hbs']
                }
            }
        },
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= documentRoot %>/*.html',
                    '<%= cssFile %>',
                    '<%= appCompiled %>'
                ]
            },
            css: {
                files: [
                    '<%= css %>/**/*.less'
                ],
                tasks: ['cssdev']
            },
            js: {
                files: [
                    '<%= app %>/**/*.js'
                ],
                tasks: ['jsdev']
            },
            jstpl: {
                files: ['<%= app %>/**/*.hbs'],
                tasks: ['handlebars']
            },
            tpl: {
                files: [
                    '<%= tpl %>/**/*.hbs'
                ],
                tasks: ['tpldev']
            }
        }
    });

    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

    // Custom tasks (aliases).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('cssdev', ['less:dev']);
    grunt.registerTask('css', ['less:production']);
    grunt.registerTask('img', ['imagemin']);
    grunt.registerTask('jsdev', ['newer:jshint:gruntfile', 'newer:jshint:dev', 'newer:jscs', 'newer:handlebars:compile', 'browserify:dev']);
    grunt.registerTask('js', ['jshint:gruntfile', 'jshint:production', 'jscs', 'handlebars', 'browserify:production', 'uglify:compile']);
    grunt.registerTask('tpldev', ['assemble:dev']);
    grunt.registerTask('tpl', ['assemble:production']);
    grunt.registerTask('dist', ['clean:production', 'copy:production']);
    grunt.registerTask('build', ['css', 'img', 'copy:js', 'js', 'tpl', 'dist']);

};
