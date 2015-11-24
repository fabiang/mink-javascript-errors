var gulp = require('gulp');
var closureCompiler = require('closure-compiler-stream');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('compile', function () {
    return gulp.src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(closureCompiler({
            jar: 'bower_components/closure-compiler/compiler.jar',
            js_output_file: 'dist/ErrorHandler.min.js'
        }))
        .pipe(sourcemaps.write('maps', { sourceRoot: "src/" }))
        .pipe(gulp.dest('dist'));
});
