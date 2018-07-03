var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var path = require('path');
var merge = require('merge-stream');
var clone = require('gulp-clone');

var paths = {
    styles: {
        src: 'src/lazyembed.scss',
        dest: 'dist'
    },
    scripts: {
        src: 'src/lazyembed.js',
        dest: 'dist'
    }
};

gulp.task('clean:styles', function() {
    return del(path.join(paths.styles.dest, '**/*.css'), {
        force: true
    });
});

gulp.task('clean:scripts', function() {
    return del(path.join(paths.scripts.dest, '**/*.js'), {
        force: true
    });
});

gulp.task('build:styles', ['clean:styles'], function() {
    var source = gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe(postcss([
        autoprefixer()
    ]));

    var styles = source.pipe(clone())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));

    var minified = source.pipe(clone())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(postcss([
        cssnano()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));

    return merge(styles, minified);
});

gulp.task('build:scripts', ['clean:scripts'], function() {
    var source = gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: [
            [
                'env',
                {
                    modules: false
                }
            ]
        ],
        plugins: [
            'transform-es2015-modules-strip'
        ]
    }));

    var scripts = source.pipe(clone())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));

    var minified = source.pipe(clone())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));

    return merge(scripts, minified);
});

gulp.task('build', ['build:styles', 'build:scripts']);

gulp.task('default', ['build']);
