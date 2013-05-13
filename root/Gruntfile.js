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
                    compress: true,
                    urlfunc: 'embedurl' // use embedurl('test.png') in our code to trigger Data URI embedding
                },
                files: {
                    'css/style.css': 'css/main.styl'
                }
            }
        },
        // https://github.com/stubbornella/csslint/wiki/Rules
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            dev: {
                src: ['css/style.css']
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
                src: ['bower/normalize-css/normalize.css', 'css/style.css'],
                dest: 'css/style.css'
            },
            js: {
                src: ['js/main-compiled.js'],
                dest: 'js/main-compiled.js'
            }
        },
        cssmin: {
            compress: {
                // used for production build
                files: {
                    'css/style.css': ['bower/normalize-css/normalize.css', 'css/style.css']
                }
            },
            with_banner: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    'css/style.css': ['css/style.css']
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
            js: {
                options: {
                    jshintrc: 'js/.jshintrc'
                },
                src: ['js/main.js', 'js/app/**/*.js']
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/main.js',
                    name: 'main',
                    out: 'js/main-compiled.js'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            css: {
                files: 'css/**/*.styl',
                tasks: ['cssdev']
            },
            js: {
                files: '<%= jshint.js.src %>',
                tasks: ['jshint:js']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['index.html', 'css/style.css', '<%= jshint.js.src %>']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task.
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('cssdev', ['stylus', 'concat:css']);
    grunt.registerTask('css', ['stylus', 'cssmin']);
    grunt.registerTask('js', ['jshint']);
    grunt.registerTask('build', ['css', 'jshint', 'requirejs', 'concat:js']);

};
