var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    bust = require('gulp-buster')

// Bust Config
bust.config({
    algo: 'sha1',
    length: 6
});

// Error catching
function handleError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Styles
gulp.task('styles', function() {
  return gulp.src('app/scss/style.scss')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sass({ quiet: true }))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('public/static/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/static/styles'))
    .pipe(bust('busters.json'))
    .pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/static/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/static/scripts'))
    .pipe(bust('busters.json'))
    .pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Watch
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('app/scss/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('app/js/**/*.js', ['scripts']);
});

// Initiate and watch
gulp.task('initiate-and-watch', ['styles', 'scripts', 'watch']);
