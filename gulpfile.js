'use strict';
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test-server', function() {
  gulp.src(['./src/server/**/*.test.js'])
      .pipe(mocha());
});

gulp.task('build', function() {
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['./src/server/**/*.js'], ['test-server']);
  console.log(`Watching in Process ID ${process.pid}`);
});
