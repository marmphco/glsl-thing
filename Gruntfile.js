module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
         build: {
            src: ['src/*.js'],
            dest: 'build/<%= pkg.name %>.min.js'
         }
      },
      uglify: {
         options: {},
         build: {
            src: 'build/<%= pkg.name %>.min.js',
            dest: 'build/<%= pkg.name %>.min.js'
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');

   grunt.registerTask('default', ['concat']);
};
