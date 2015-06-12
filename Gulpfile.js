// Command List:
// init			=> runs all commands to get boilerplate up and running
// scripts	=> uglifies js
// less			=> uglifies less
// uncss 		=> uses phantomjs to visit your specified pages and write only the used/computed styles to a file
// iconfont	=> creates fonts from svg files
//---


// Include gulp
var gulp = require('gulp'); 

// Load all gulp plugins automatically and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Unsure how to get these to work with gulp-load-plugins
var autoprefixer = require('autoprefixer-core');
var mqpacker     = require('css-mqpacker');
var focus 			 = require('postcss-focus');


var pkg = require('./package.json');

// Used for writing to directories
var dirs = {
	"src": "src",
	"dist": "public",
	"assets": "public/assets",
}

// Used for getting files
var paths = {
	scripts: [
		dirs.src + '/js/*.js',
		dirs.src + '/js/scripts/*.js',
	],
	less: [
		dirs.src + '/less/**/*.less',
	],
	views: [
		dirs.dist + '/views/**/*.php',
		dirs.dist + '/views/**/*.html',
	],
}


// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src( paths.scripts )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.concat('main.js'))
	.pipe(gulp.dest( dirs.assets + '/js/' ))
	.pipe(plugins.uglify())
	.pipe(plugins.rename('main.min.js'))
	.pipe(gulp.dest( dirs.assets + '/js/' ))
	.pipe(plugins.livereload());
});


// Compile our less
gulp.task('less', function() {
	// Make sure our css is compatible with the last two versions of all browsers
	// For all ::hover styles duplicate a ::focus style
	// Condense mediaquery calls
	var processors = [
		autoprefixer({browsers: ['last 2 version']}),
		focus,
		mqpacker,
	];

	return gulp.src( 'src/less/main.less' )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line),
			plugins.util.colors.yellow('\r\nCode Extract: '+error.extract)
			);
		this.emit('end');
	}))
	.pipe(plugins.less())
	.pipe(plugins.postcss( processors ))
	.pipe(plugins.minifyCss())
	.pipe(plugins.rename('main.min.css'))
	.pipe(gulp.dest( dirs.assets + '/css/' ))
	.pipe(plugins.livereload());
});


// Use PhantomJS to UnCSS
gulp.task('uncss', ['less'], function() {
	return gulp.src( paths.css )
	.pipe(plugins.concat('uncss.css'))
	// for debugging only
	// .pipe(gulp.dest( dirs.assets + '/css/' ))
	.pipe(plugins.uncss({
		// provide the pages you would like phantomjs to scan for styles
		html: [
			'http://website.local/',
		],
		// styles to include regardless if phantomjs finds them on those pages
		// hover, click, focus, active are common offendors
		ignore: [
			// /hover/,
			// /click/,
			// /focus/,
			// /active/,

			// needed for Bootstraps transitions
			/\.open/,
			/\.open+/,
			/\.fade/,
			/\.fade+/,
			/\.collapse/,
			/\.collapse+/,
			/\.alert-danger/,
		]
	}))
	.pipe(plugins.minifyCSS({keepSpecialComments:0}))
	.pipe(plugins.rename('uncss.min.css'))
	.pipe(gulp.dest( dirs.assets + '/css/' ));
});


// Compile our font icons
gulp.task('iconfont', function(){
	// rename font if you want it to be something more specific
	var fontname = 'website-icons';
	// class name, dash will be added to the end ex: icon-
	var classname = 'icon';

	return gulp.src([dirs.src + '/icons/svg/*.svg'])
		.pipe(plugins.iconfont({ 
			fontName: fontname 
		}))
		.on('codepoints', function (codepoints, options) {
			// uncomment if you want to be garaunteed that you icons will have the same UTF code
			// codepoints.forEach(function (glyph, idx, arr) {
			// 	arr[idx].codepoint = glyph.codepoint.toString(16);
			// });
			gulp.src(dirs.src + '/icons/iconfont.template')
				.pipe(plugins.consolidate('lodash', {
					glyphs: codepoints,
					fontName: fontname,
					fontPath: '../fonts/',
					className: classname
				}))
				.pipe(plugins.rename('iconfont.less'))
				.pipe(gulp.dest( dirs.src + '/less/iconfonts' ));
		})
		.pipe(gulp.dest( dirs.assets + '/fonts' ));
});


// Bower Update Task
gulp.task('bower', function() {
	return plugins.bower();
});


// Migrate Vendor Dependencies 
gulp.task('vendor',['bower'], function() {

	//
	gulp.src( 'src/vendor/bootstrap/dist/js/bootstrap.min.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

	//
	gulp.src( 'src/vendor/bootstrap/less/**/*' )
	.pipe(gulp.dest( 'src/less/vendor/bootstrap' ));

	//
	gulp.src( 'src/vendor/jquery/dist/jquery.min.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

	//
	gulp.src( 'src/vendor/modernizr/modernizr.js' )
	.pipe(gulp.dest( dirs.assets + '/js/plugins' ));

});


// Watch Files For Changes
gulp.task('watch', function() {
	plugins.livereload.listen();
	gulp.watch( paths.scripts , ['scripts']);
	gulp.watch( paths.less , ['less']);
	gulp.watch(paths.views).on('change', function (event) {
		plugins.livereload.changed(event.path);
	});
});

// Init our files
gulp.task('init', ['vendor', 'iconfont'], function (event) {
	gulp.run('scripts');
	gulp.run('less');
});

gulp.task('default', ['scripts', 'less', 'watch']);
