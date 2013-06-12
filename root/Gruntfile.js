'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('{%= basicjson %}'),
        banner: '/*!\n' +
            ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> \n */\n',
        // Task configuration.
        stylus: {
            compile: {
                options: {
                    compress: false,
                    urlfunc: 'embedurl' // use embedurl('test.png') in our code to trigger Data URI embedding
                },
                files: {
                    'www/css/stylus.css': 'www/css/main.styl'
                }
            }
        },
        // https://github.com/stubbornella/csslint/wiki/Rules
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            dev: {
                src: ['www/css/stylus.css']
            },
            production: {
                options: {
                    'star-property-hack': false,
                    'important': false,
                    'adjoining-classes': false,
                    'universal-selector': false,
                    'compatible-vendor-prefixes': false,
                    'regex-selectors': false,
                    'box-sizing': false,
                    'unqualified-attributes': false,
                    'outline-none': false
                },
                src: ['css/style.css']
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            // used for dev css build
            css: {
                src: ['www/bower/normalize-css/normalize.css', 'www/css/stylus.css'],
                dest: 'www/css/style.css'
            },
            js: {
                src: ['www/js/app-compiled.js'],
                dest: 'www/js/app-compiled.js'
            }
        },
        // used for production build
        cssmin: {
            compress: {
                options: {
                    banner: '<%= banner %>',
                    report: 'gzip'
                },
                files: {
                    'www/css/style.css': ['www/css/stylus.css']
                }
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            jsdev: {
                options: {
                    jshintrc: 'www/js/.jshintrc-dev'
                },
                src: ['www/js/app/**/*.js', '!www/js/app/**/*.hbs.js']
            },
            js: {
                options: {
                    jshintrc: 'www/js/.jshintrc'
                },
                src: ['www/js/app/**/*.js', '!www/js/app/**/*.hbs.js']
            }
        },
        jsvalidate: {
            files: ['www/js/app/**/*.js', '!www/js/app/**/*.hbs.js']
        },
        handlebars: {
            compile: {
                options: {
                    namespace: false,
                    amd: true
                },
                files: [{
                    expand: true,
                    src: ['www/js/app/**/*.hbs'],
                    dest: '',
                    ext: '.hbs.js'
                }]
            }
        },
        requirejs: {
            compile: {
                options: {
                    almond: true,
                    baseUrl: 'www/js/app',
                    mainConfigFile: 'www/js/app/main.js',
                    name: 'main',
                    out: 'www/js/app-compiled.js'
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ['www/index.html', 'www/css/style.css', '<%= jshint.js.src %>']
            }
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile', 'jsvalidate']
            },
            css: {
                files: 'www/css/**/*.styl',
                tasks: ['cssdev']
            },
            js: {
                options: {
                    livereload: true
                },
                files: '<%= jshint.js.src %>',
                tasks: ['jshint:jsdev']
            },
            handlebars: {
                options: {
                    livereload: true
                },
                files: 'www/js/app/**/*.hbs',
                tasks: ['handlebars']
            }
        },
        clean: {
            css: 'www/css/stylus.css',
            build: [
                'www/css/stylus.css',
                'www/css/style.css',
                'www/js/app.js',
                'www/js/app/**/*.hbs.js'
            ],
            bower: 'www/bower',
            npm: 'node_modules',
            pack: [
                '.bowerrc',
                '.csslintrc',
                '.editorconfig',
                '.gitattributes',
                '.gitignore',
                '.jshintrc',
                'Gruntfile.js',
                'README.md',
                '*.json',
                'node_modules',
                'www/css/*.styl',
                'www/js/*',
                '!www/js/app-compiled.js',
                'www/js/.jshintrc',
                'www/js/.jshintrc-dev',
                'www/bower'
            ]
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Custom tasks (aliases).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('cssdev', ['stylus', 'concat:css', 'clean:css']);
    grunt.registerTask('css', ['stylus', 'cssmin', 'clean:css']);
    grunt.registerTask('jsdev', ['jshint:gruntfile', 'jshint:jsdev', 'jsvalidate']);
    grunt.registerTask('js', ['handlebars', 'jshint:gruntfile', 'jshint:js', 'jsvalidate']);
    grunt.registerTask('build', ['css', 'js', 'requirejs', 'concat:js']);
    // Beware of 'grunt pack' task
    grunt.registerTask('pack', ['build', 'clean:pack']);

};
