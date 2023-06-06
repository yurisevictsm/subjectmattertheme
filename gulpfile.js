'use strict';

var gulp = require('gulp');
var sass = require('gulp-dart-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

sass.compiler = require('sass');
const { watch, series } = require('gulp');

var sassDest = 'scss/';
var cssDest = 'css/';
var sassSrc = [sassDest +'**/*.s+(a|c)ss'];
var sassMain = sassDest +'style.scss';

function scssTask() {
  return gulp.src( sassMain )
    .pipe( sourcemaps.init() )
    .pipe( sass({outputStyle: 'expanded'}).on('error', sass.logError) )
    .pipe( autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false }) )
    .pipe( sourcemaps.write('./sourcemaps') )
    .pipe( gulp.dest(cssDest) );
}

// Concat and minify application specific JS files
gulp.task('build-js', function () {
  return gulp.src(['js/scripts.js'])
      .pipe(concat('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('js'));
});

function watchTask(){
    gulp.watch(sassSrc, scssTask);
    gulp.watch('js/scripts.js', gulp.series('build-js'));
}

exports.default = function() {
  watch(sassSrc, { ignoreInitial: false }, series(scssTask, watchTask));
};