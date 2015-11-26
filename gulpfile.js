var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var tsify = require('tsify');
var del = require('del');

gulp.task('default', ['process-html', 'process-css', 'process-js']);

gulp.task('clean', function() {
    return del([
        'build/'
    ]);
});

gulp.task('process-js', function() {
    return browserify({
        entries: ['src/ts/app/app.tsx']
    })
    .plugin(tsify, {
        jsx: 'react',
        module: 'commonjs',
    })
    .bundle()
    .pipe(source('glsl-thing.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});

gulp.task('process-html', function() {
    return gulp.src('src/html/index.html')
        .pipe(gulp.dest('build'));
});

gulp.task('process-css', function() {
    return gulp.src([
        'src/css/**/*.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(gulp.dest('build/css/'))
});

gulp.task('watch', function() {
    return gulp.watch('src/ts/**/*.tsx', ['process-js'])
});