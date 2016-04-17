gulp         = require 'gulp'
nodemon      = require 'gulp-nodemon'
livereload   = require 'gulp-livereload'
sass         = require 'gulp-sass'
autoprefixer = require 'gulp-autoprefixer'


gulp.task 'sass', ->
  gulp.src 'app/assets/styles/**/*.scss'
    .pipe sass set: ['compress']
    .pipe autoprefixer browsers: ['last 2 versions'], cascade: false
    .pipe gulp.dest 'public/styles'
    .pipe livereload()

gulp.task 'watch', ->
  livereload.listen()
  gulp.watch 'app/assets/styles/**/*.scss', ['sass']


gulp.task 'default', ['sass', 'watch'], ->
  nodemon(
    script: 'app.js'
    ext: 'js').on 'restart', ->
    gulp.src('app.js').pipe livereload()