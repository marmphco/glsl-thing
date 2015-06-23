module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy: {
         main: {
            files: [
               {src: 'html/index.html', dest: 'build/index.html'},
               {src: 'css/*', dest: 'build/'},
               {src: 'img/*', dest: 'build/'}
            ]
         }
      },
      uglify: {
         options: {
            mangle: true,
            compress: true,
            sourceMap: true
         },
         build: {
            src: 'build/js/<%= pkg.name %>.min.js',
            dest: 'build/js/<%= pkg.name %>.min.js'
         }
      },
      browserify: {
         options: {
            transform: [
               ['babelify', {'blacklist': 'validation.react'}]
            ]
         },
         build: {
            src: [
               'src/app/app.js',
            ],
            dest: 'build/js/<%= pkg.name %>.min.js'
         }
      },
   });

   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-browserify');

   grunt.registerTask('full', ['copy', 'browserify', 'uglify']);
   grunt.registerTask('default', ['copy', 'browserify']);
};
