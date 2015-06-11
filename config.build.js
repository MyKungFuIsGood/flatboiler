module.exports = {
	build_dir: 'build',
	compile_dir: 'public',

	app_files: {
		js: [
			'src/**/*.js',
			'!src/assets/**/*.js'
		],
		views: [
			'src/index.html',
			'views/**/*.html'
		],
		less: 'src/less/main.less'
	},

	vendor_files: {
		js: [

		],
		cdn: [

		],
		css: [
		],
		assets: [
		]
	}
}