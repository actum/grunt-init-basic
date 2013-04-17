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
                    '<%= concat.css.dest %>': 'css/main.styl'
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            css: {
                src: ['css/style.css'],
                dest: 'css/style.css'
            },
            js: {
                src: ['js/main-compiled.js'],
                dest: 'js/main-compiled.js'
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
                tasks: ['css']
            },
            js: {
                files: '<%= jshint.js.src %>',
                tasks: ['jshint:js']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Default task.
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('css', ['stylus']);
    grunt.registerTask('js', ['jshint']);
    grunt.registerTask('build', ['css', 'concat:css', 'jshint', 'requirejs', 'concat:js']);

};
