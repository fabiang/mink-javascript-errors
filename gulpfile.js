var gulp = require('gulp');
var closureCompiler = require('closure-compiler-stream');
var sourcemaps = require('gulp-sourcemaps');
var trim = require('gulp-trim');

gulp.task('compile', function () {
    return gulp.src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(closureCompiler({
            jar: 'bower_components/closure-compiler/compiler.jar',
            js_output_file: 'ErrorHandler.min.js'
        }))
        .pipe(trim())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist'));
});
