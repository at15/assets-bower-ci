/**
 * Created by at15 on 15-4-19.
 */

'use strict';

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha');

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

gulp.task('test', ['lint'], function () {
    return gulp.src(
        'test/*.js'
    )
        .pipe(mocha());
});

gulp.task('default', ['test'], function () {
    console.log('This is the default gulp task.');
});
