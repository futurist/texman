// http://www.sitepoint.com/transpiling-es6-modules-to-amd-commonjs-using-babel-gulp/
// npm install mithril gulp gulp-babel babel-preset-es2015 babel-plugin-transform-object-assign browserify gulp-browserify vinyl-source-stream vinyl-buffer gulp-uglify del gulp-rename --save-dev

var gulp = require('gulp');
var babel = require('gulp-babel'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del');

gulp.task('clean-temp', function(){
  return del(['compiled']);
});

gulp.task('es6-commonjs',['clean-temp'], function(){
  return gulp.src(['script/*.js','script/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('compiled/temp'));
});

// commonjs-bundle
gulp.task('default',['es6-commonjs'], function(){
  return browserify(['compiled/temp/app.js']).bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    // .pipe(uglify())
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./'));
});

