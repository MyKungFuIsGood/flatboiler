// Command List:
// init			=> runs all commands to get boilerplate up and running
// lint			=> checks js but will not throw errors or logs
// scripts	=> uglifies js
// less			=> uglifies less
// iconfont	=> creates fonts from svg files
//---


// Include gulp
var gulp = require('gulp'); 


// Include Our Plugins
var bower				= require('gulp-bower');
var jshint			= require('gulp-jshint');
var less				= require('gulp-less');
var concat			= require('gulp-concat');
var uglify			= require('gulp-uglify');
var rename			= require('gulp-rename');
var minifyCSS		= require('gulp-minify-css');
var uncss				= require('gulp-uncss');
var del					= require('del');
var plumber			= require('gulp-plumber'); // error handling
var consolidate	= require('gulp-consolidate'); // icon templating
var iconfont		= require('gulp-iconfont'); // svg to iconfont
var livereload	= require('gulp-livereload');
var gutil				= require('gulp-util');


var watchJS = [
	'_src/js/_scripts/*.js',
	'_src/js/_*.js' 

];

var watchLESS = [
	'_src/less/*.less',
	'_src/less/partials/*.less',
	'_src/less/iconfonts/*.less',
];

var distJS = 'assets/js';
var distCSS = 'assets/css';


var scriptsJS = [
];


// Lint Task
gulp.task('lint', function() {
	return gulp.src( watchJS )
		.pipe(jshint())
		// .pipe(jshint.reporter('default'));
});


// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src( watchJS )
	.pipe(concat('main.js'))
	.pipe(gulp.dest( distJS ))
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(gulp.dest( distJS ))
	.pipe(livereload());
});


// Compile Our less
gulp.task('less', function() {
	return gulp.src( '_src/less/main.less' )
	.pipe(plumber(function(error) {
		gutil.log(
			gutil.colors.red(error.message),
			gutil.colors.yellow('\r\nOn line: '+error.line),
			gutil.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(less())
	.pipe(minifyCSS())
	.pipe(rename('main.min.css'))
	.pipe(gulp.dest( distCSS ))
	.pipe(livereload());
});


// Use PhantomJS to UnCSS
// gulp.task('uncss', ['less'], function() {
// 	return gulp.src( unCSS )
// 	.pipe(concat('uncss.css'))
// 	.pipe(gulp.dest( distCSS ))
// 	.pipe(uncss({
// 		html: [
// 		'http://website.local/',
// 		],
// 		ignore: [
// 			/hover/,
// 			/click/,
// 			/focus/,
// 			/active/,
// 			// needed for Bootstraps transitions
// 			/\.open/,
// 			/\.open+/,
// 			/\.fade/,
// 			/\.fade+/,
// 			/\.collapse/,
// 			/\.collapse+/,
// 			/\.alert-danger/,
// 			]
// 		}))
// 	.pipe(minifyCSS({keepSpecialComments:0}))
// 	.pipe(rename('uncss.min.css'))
// 	.pipe(gulp.dest( distCSS ));
// });


gulp.task('iconfont', function(){
	gulp.src(['_src/icons/svg/*.svg'])
		.pipe(iconfont({ fontName: 'website-icons' }))
		.on('codepoints', function(codepoints, options) {
			gulp.src('_src/icons/iconfont.template')
				.pipe(consolidate('lodash', {
					glyphs: codepoints,
					fontName: 'website-icons',
					fontPath: '/assets/fonts/',
					className: 'icon'
				}))
				.pipe(rename('_iconfont.less'))
				.pipe(gulp.dest('_src/less/iconfonts/'));
	})
	.pipe(gulp.dest('assets/fonts/'));
});


// Bower Update Task
gulp.task('bower', function() {
	return bower();
});


// Migrate Vendor Dependencies 
gulp.task('vendor',['bower'], function() {


	//
	gulp.src( scriptsJS )
	.pipe(gulp.dest( '_src/js/_scripts'));

	//
	gulp.src( '_src/vendor/bootstrap/dist/js/bootstrap.min.js' )
	.pipe(gulp.dest( 'assets/js/plugins' ));

	//
	gulp.src( '_src/vendor/bootstrap/less/*' )
	.pipe(gulp.dest( '_src/less/vendor/bootstrap' ));

	//
	gulp.src( '_src/vendor/jquery/dist/jquery.min.js' )
	.pipe(gulp.dest( 'assets/js/plugins' ));


});


// Watch Files For Changes
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch( watchJS , ['lint', 'scripts']);
	gulp.watch( watchLESS , ['less']);
});

/* Run this first */
gulp.task('init', ['vendor', 'lint', 'scripts', 'iconfont', 'less'] );