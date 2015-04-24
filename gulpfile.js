/**
 * Created by at15 on 15-4-19.
 */

'use strict';

var gulp = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('lint', function () {
    return gulp.src([
        '*.js',
        'lib/*.js',
        'test/*.js'
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('default', ['lint'], function () {
    console.log('This is the default gulp task.');
});

