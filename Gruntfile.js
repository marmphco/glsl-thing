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
         options: {
            transform: [require('grunt-react').browserify]
         },
         build: {
            src: [
               'src/demo.js',
            ],
            dest: 'build/<%= pkg.name %>.min.js'
         }
      },
      react: {
         files: {
            src: ["src/ui/*.jsx"]
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-browserify');
   grunt.loadNpmTasks('grunt-react');

   grunt.registerTask('full', ['browserify', 'uglify']);
   grunt.registerTask('default', ['browserify']);
};
