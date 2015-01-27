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
        },

        watch: {
            src: {
                files: [
                    'src/**/*.js'
                ],
                tasks: ['traceur']
            }
        },

        traceur: {
            options: {
                traceurRuntime: './node_modules/traceur/bin/traceur-runtime.js',
                traceurCommand: './node_modules/traceur/src/node/command.js',
                traceurOptions: '--source-map --experimental'
            },
            minimal: {
                files: {
                    './dist/connect-flux.js': './src/ngFlux.js'
                }
            },
            standalone: {
                options: {
                    includeRuntime: true
                },
                files: {
                    './dist/connect-flux-with-runtime.js': './src/ngFlux.js'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-traceur-simple');

    // Default task.
    grunt.registerTask('dev', ['karma', 'watch']);
    grunt.registerTask('default', ['dev']);
};
