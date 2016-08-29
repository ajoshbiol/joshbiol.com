var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var path = '../jarvis';

// Handle configs
gulp.task('configs', function() {
    // public facing configs
    gulp.src(path + '/src/js/configs/' + process.env.NODE_ENV + '.js')
        .pipe(rename('configs.js'))
        .pipe(gulp.dest(path + '/src/js'));

    // service configs
    return gulp.src(path + '/configs/' + process.env.NODE_ENV + '.js')
        .pipe(rename('configs.js'))
        .pipe(gulp.dest(path));
});

// Handle externals
// Lint Task
gulp.task('lint', function() {
    return gulp.src([ path + '/src/js/*.js', path + '/src/js/configs/' + 
        process.env.NODE_ENV + '.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([ path + '/src/js/index.js', path + '/src/js/configs/' + 
        process.env.NODE_ENV + '.js'])
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path + '/public/js'));
});

// Handle my css file
gulp.task('css', function() {
    return gulp.src(path + '/src/css/*.css')
        .pipe(gulp.dest(path + '/public/css'));
});

// Handle my images
gulp.task('img', function() {
    return gulp.src(path + '/src/img/**')
        .pipe(gulp.dest(path + '/public/img'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(path + '/src/js/*.js', ['lint', 'scripts']);
    gulp.watch(path + '/src/js/configs/*.js', ['lint', 'scripts']);
    gulp.watch(path + '/src/css/*.css', ['css']);
    gulp.watch(path + '/src/img/*', ['img']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch', 'css', 'img', 'configs']);
