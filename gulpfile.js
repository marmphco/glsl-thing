var gulp = require('gulp');
var changed = require('gulp-changed');
var tsc = require('gulp-typescript');
var uglify = require('gulp-uglify');
var browserify = require('browserify-incremental');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');

gulp.task('default', ['package-html', 'package-css', 'package-js']);

// Utility

gulp.task('clean', function() {
    return del([
        'build',
        'browserify-cache.json'
    ]);
});

// Packaging

gulp.task('package-js', ['build-ui', 'build-lib'], function() {
    return browserify({
        entries: ['build/ui/glsl-thing.js'],
        cacheFile: 'browserify-cache.json'
    })
    .bundle()
    .pipe(source('glsl-thing.min.js'))
    .pipe(buffer())
    //.pipe(uglify())
    .pipe(gulp.dest('build/app/js'));
});

gulp.task('package-html', function() {
    return gulp.src('src/html/index.html')
        .pipe(changed('build/app'))
        .pipe(gulp.dest('build/app'));
});

gulp.task('package-css', function() {
    return gulp.src([
        'src/css/**/*.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css.map'
    ])
    .pipe(changed('build/app/css'))
    .pipe(gulp.dest('build/app/css'))
});

// Building

gulp.task('build-ui', function() {
    return gulp.src([
        'src/ts/ui/*.tsx'
    ])
    .pipe(changed('build/ui', {
        extension: '.js'
    }))
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
    .pipe(changed('build/lib', {
        extension: '.js'
    }))
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
    .pipe(changed('build/spec', {
        extension: '.js'
    }))
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

    return jasmine.execute();
});