/*global module:false*/
module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: './dist/*'
        },

        jshint: {
            options: {
                force: true,
                jshintrc: '.jshintrc'
            },
            lib: {
                src: 'js/**/*.js'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },

        release: {
            options: {
                file: 'bower.json',
                npm: false
            }
        },

        karma: {
            unit: {
                configFile: './tests/karma.conf.js'
            }
        },

        watch: {
            src: {
                files: [
                    'src/**/*.js'
                ],
                tasks: ['babel']
            }
        },

        'babel': {
            options: {
                sourceMap: true,
                experimental: true
            },
            amd: {
                options: {
                    modules: 'amd'
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'dist/amd/'
                }]
            },
            system: {
                options: {
                    modules: 'system'
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'dist/system/'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-babel');

    // Default task.
    grunt.registerTask('build', ['clean', 'babel:amd']);
    grunt.registerTask('default', ['dev']);
};
