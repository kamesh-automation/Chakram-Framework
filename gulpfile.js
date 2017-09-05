const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('api', function () {
  //console.log('yayyy!!!');
  return gulp.src('./scripts/*.js')
	.on('error', console.log)
	.pipe(gulp.dest('./results'))
	.pipe(mocha({reporter: 'mochawesome',
	  reporterOptions: {
		reportTitle: 'Chakram-API-Automation',
		reportDir: 'results',
		reportFilename: 'report',
		enableCharts: 'true'
	  }}));
});