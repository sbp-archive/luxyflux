/*global module:false*/
module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

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
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-karma');

    // Default task.
    grunt.registerTask('default', ['jshint', 'karma']);
};
