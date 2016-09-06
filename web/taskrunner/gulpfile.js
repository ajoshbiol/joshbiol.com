var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');

// Handle configs
gulp.task('configs', function() {

    // Service configs
    gulp.src('../service/configs/' + process.env.NODE_ENV + '.js')
        .pipe(rename('configs.js'))
        .pipe(gulp.dest('../service'));

    // public facing configs
    return gulp.src('../src/js/configs/' + process.env.NODE_ENV + '.js')
        .pipe(rename('configs.js'))
        .pipe(gulp.dest('../src/js'));
});

// Handle externals
// Lint Task
gulp.task('lint', function() {
    return gulp.src(['../src/js/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['../src/js/index.js', '../src/js/configs/' + 
        process.env.NODE_ENV + '.js'])
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../public/js'));
});

// Handle my css file
gulp.task('css', function() {
    return gulp.src('../src/css/*.css')
        .pipe(gulp.dest('../public/css'));
});

// Handle my html
gulp.task('html', function() {
    return gulp.src('../src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('../public'));
});

// Handle my images
gulp.task('img', function() {
    return gulp.src('../src/img/**')
        .pipe(gulp.dest('../public/img'));
});

// Copy assets
gulp.task('assets', function() {
    return gulp.src(['../assets/**', '!../assets/package.json'])
        .pipe(gulp.dest('../public/assets'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('../src/js/*.js', ['lint', 'scripts']);
    gulp.watch('../src/js/configs/*.js', ['lint', 'scripts']);
    gulp.watch('../src/css/*.css', ['css']);
    gulp.watch('../src/img/*', ['img']);
    gulp.watch('../src/*.html', ['html']);
});

// Default Task
gulp.task('default', ['configs', 'lint', 'scripts', 'watch', 'css', 'img', 
    'html', 'assets']);
