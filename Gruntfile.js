module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
         options: {
            mangle: true,
            compress: true,
            sourceMap: true
         },
         build: {
            src: 'build/<%= pkg.name %>.min.js',
            dest: 'build/<%= pkg.name %>.min.js'
         }
      },
      browserify: {
         build: {
            src: [
               'src/demo.js',
            ],
            dest: 'build/<%= pkg.name %>.min.js'
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-browserify');

   grunt.registerTask('default', ['browserify', 'uglify']);
};
