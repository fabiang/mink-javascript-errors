var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('compile', function () {
    return gulp.src('src/*.js')
        .pipe(closureCompiler({
            compilerPath: 'bower_components/closure-compiler/compiler.jar',
            fileName: 'ErrorHandler.min.js'
        }))
        .pipe(gulp.dest('dist'));
});
