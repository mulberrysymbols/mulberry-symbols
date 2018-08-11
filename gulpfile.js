// from ShayC - simple Gulp script to optimised the SVGs
//
var gulp = require('gulp');
var svgmin = require('gulp-svgmin');

gulp.task('default', function() {
  return gulp
    .src('EN/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('./dist'));
});
