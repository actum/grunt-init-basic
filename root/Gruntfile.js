'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('{%= basicjson %}'),
        www: 'www',
        bower: 'www/bower',
        styles: 'www/less',
        css: 'www/css',
        img: 'www/img',
        app: 'www/app',
        js: 'www/js',
        tpl: 'www/tpl',
        dist: 'dist',

        less: {
            options: {
                paths: [
                    '<%= styles %>',
                    '<%= bower %>'
                ],
                relativeUrls: true
            },
            dev: {
                options: {
                    sourceMap: true,
                    sourceMapFilename: '<%= css %>/style.css.map',
                    sourceMapURL: 'style.css.map',
                    sourceMapBasepath: '<%= www %>',
                    outputSourceFiles: true
                },
                files: {
                    '<%= css %>/style.css': '<%= styles %>/main.less'
                }
            },
            production: {
                files: {
                    '<%= css %>/style.css': '<%= styles %>/main.less'
                }
            }
        },

        cssmin: {
            min: {
                files: {
                    '<%= css %>/style.min.css': '<%= css %>/style.css'
                }
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),

                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                indent: 4,
                white: false,
                quotmark: 'single',
                trailing: true,
                node: true,
                jquery: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            dev: {
                options: {
                    undef: false,
                    unused: false
                },
                src: [
                    '<%= app %>/**/*.js'
                ]
            },
            production: {
                options: {
                    browser: true
                },
                src: [
                    '<%= app %>/**/*.js'
                ]
            }
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: [
                '<%= app %>/**/*.js'
            ]
        },

        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ]
            },
            dev: {
                options: {
                    debug: true
                },
                files: {
                    '<%= js %>/app-compiled.js': ['<%= app %>/app.js']
                }
            },
            production: {
                files: {
                    '<%= js %>/app-compiled.js': ['<%= app %>/app.js']
                }
            }
        },

        react: {
            files: {
                expand: true,
                cwd: '<%= app %>',
                src: ['**/*.jsx'],
                dest: '<%= app %>',
                ext: '.js'
            }
        },

        uglify: {
            options: {
                report: 'min'
            },
            compile: {
                files: {
                    '<%= js %>/app-compiled.min.js': ['<%= js %>/app-compiled.js']
                }
            }
        },

        clean: {
            production: ['<%= dist %>'],
            build: [
                '<%= css %>/*',
                '<%= js %>/*',
                '<%= www %>/*.html'
            ]
        },

        copy: {
            options: {
                nonull: true
            },
            js: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%= bower %>/respond/dest/respond.min.js'],
                    dest: '<%= js %>'
                }]
            },
            production: {
                files: [{
                    expand: true,
                    cwd: 'www',
                    src: [
                        'css/*.css',
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
                    '<%= www %>': ['<%= tpl %>/pages/**/*.hbs']
                }
            },
            production: {
                options: {
                    data: '<%= tpl %>/production/*.json',
                    partials: ['<%= tpl %>/partials/**/*.hbs'],
                    layout: '<%= tpl %>/layouts/default.hbs'
                },
                files: {
                    '<%= www %>': ['<%= tpl %>/pages/**/*.hbs']
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
                    '<%= www %>/*.html',
                    '<%= css %>/style.css',
                    '<%= js %>/app-compiled.js'
                ]
            },
            css: {
                files: [
                    '<%= styles %>/**/*.less'
                ],
                tasks: ['cssdev']
            },
            js: {
                files: [
                    '<%= app %>/**/*.{js,jsx}'
                ],
                tasks: ['jsdev']
            },
            tpl: {
                files: [
                    '<%= tpl %>/**/*.hbs'
                ],
                tasks: ['tpldev']
            }
        }
    });

    require('jit-grunt')(grunt);

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('cssdev', ['less:dev']);
    grunt.registerTask('css', ['less:production', 'cssmin']);
    grunt.registerTask('jsdev', ['newer:jshint:gruntfile', 'newer:jshint:dev', 'newer:jscs', 'browserify:dev']);
    grunt.registerTask('js', ['jshint:gruntfile', 'jshint:production', 'jscs', 'browserify:production', 'uglify:compile']);
    grunt.registerTask('tpldev', ['assemble:dev']);
    grunt.registerTask('tpl', ['assemble:production']);
    grunt.registerTask('dist', ['clean:production', 'copy:production']);
    grunt.registerTask('build', ['clean:build', 'css', 'copy:js', 'js', 'tpl', 'dist']);

};
