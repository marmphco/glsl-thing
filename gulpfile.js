var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var tsc = require('gulp-typescript');
var browserify = require('browserify');
var uglify = require('gulp-uglify');

gulp.task('default', ['package-html', 'package-css', 'package-js']);

// Utility

gulp.task('clean', function() {
    del([
        'build/'
    ]);
});

// Packaging

gulp.task('package-js', ['build-ui', 'build-lib'], function() {
    return browserify({
        entries: ['build/ui/glsl-thing.js']
    })
    .bundle()
    .pipe(source('glsl-thing.min.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest('build/app/js/'));
});

gulp.task('package-html', function() {
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest('build/app'));
});

gulp.task('package-css', function() {
    return gulp.src([
        'src/css/**/*.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css.map'
    ])
    .pipe(gulp.dest('build/app/css/'))
});

// Building

gulp.task('build-ui', function() {
    return gulp.src([
        'src/ts/ui/*.tsx'
    ])
    .pipe(tsc({
        jsx: 'react',
        module: 'commonjs'
    }))
    .pipe(gulp.dest('build/ui'));
});

gulp.task('build-lib', function() {
    return gulp.src([
        'src/ts/lib/*.ts'
    ])
    .pipe(tsc({
        module: 'commonjs'
    }))
    .pipe(gulp.dest('build/lib'));
});

// Tests

var Jasmine = require('jasmine');

gulp.task('build-tests', function() {
    return gulp.src([
        'src/ts/test/*.ts'
    ])
    .pipe(tsc({
        module: 'commonjs'
    }))
    .pipe(gulp.dest('build/spec'));
});

gulp.task('test', ['build-lib', 'build-tests'], function() {
    var jasmine = new Jasmine();

    jasmine.loadConfig({
        "spec_dir": "build/spec",
        "spec_files": [
            "*.js"
        ],
    });

    jasmine.execute();
});