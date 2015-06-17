/**
 * Dependencies.
 */
var gulp = require('gulp'),
	jscs = require('gulp-jscs'),
	stylish = require('gulp-jscs-stylish'),
	browserify = require('browserify'),
	vinyl_source_stream = require('vinyl-source-stream'),
	jshint = require('gulp-jshint'),
	filelog = require('gulp-filelog'),
	header = require('gulp-header'),
	path = require('path'),
	fs = require('fs'),

/**
 * Constants.
 */
	PKG = require('./package.json'),

/**
 * Banner.
 */
	banner = fs.readFileSync('banner.txt').toString(),
	banner_options = {
		pkg: PKG,
		currentYear: (new Date()).getFullYear()
	};


gulp.task('lint', function () {
	var src = ['gulpfile.js', 'lib/**/*.js'];

	return gulp.src(src)
		.pipe(filelog('lint'))
		.pipe(jshint('.jshintrc'))  // Enforce good practics.
		.pipe(jscs('.jscsrc'))  // Enforce style guide.
		.pipe(stylish.combineWithHintResults())
		.pipe(jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe(jshint.reporter('fail'));
});


gulp.task('browserify', function () {
	return browserify([path.join(__dirname, PKG.main)], {
		standalone: PKG.name
	})
		.bundle()
		.pipe(vinyl_source_stream(PKG.name + '.js'))
		.pipe(filelog('browserify'))
		.pipe(header(banner, banner_options))
		.pipe(gulp.dest('dist/'));
});


gulp.task('default', gulp.series('lint', 'browserify'));
