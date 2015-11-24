var gulp = require('gulp');
var tsc = require('gulp-typescript');
var del = require('del');

gulp.task('default', ['process-html', 'process-css', 'process-js']);

gulp.task('clean', function() {
    return del([
        'build/'
    ]);
});

gulp.task('process-js', function() {
    return gulp.src('src/ts/**/*.ts')
        .pipe(tsc({
            jsx: 'react',
            out: 'glsl-thing.js'
        })).js
        .pipe(gulp.dest('build/js/'));
});

gulp.task('process-html', function() {
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest('build'));
});

gulp.task('process-css', function() {
    return gulp.src('src/css/**/*.less')
        .pipe(gulp.dest('build/css/main.css'));
});

gulp.task('watch', function() {
    return gulp.watch('src/ts/**/*.ts', ['process-js'])
});