module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
         build: {
            src: [
               'src/gt-port.js',
               'src/gt-mesh.js',
               'src/gt-node.js',
               'src/gt-value-node.js',
               'src/gt-image-node.js',
               'src/gt-mesh-node.js',
               'src/gt-shader-node.js',
               'src/gt-program-node.js',
               'src/gt-render-node.js',
               'src/glsl-thing.js',
            ],
            dest: 'build/<%= pkg.name %>.min.js'
         }
      },
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
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');

   grunt.registerTask('default', ['concat', 'uglify']);
};
