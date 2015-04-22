var gulp            = require('gulp'),
    browserSync     = require('browser-sync').create(),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    minifyCSS       = require('gulp-minify-css'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    autoprefixer    = require('gulp-autoprefixer'),
    cmq             = require('gulp-combine-media-queries'),
    spritesmith     = require('gulp.spritesmith')
    svgSprite       = require('gulp-svg-sprite')
    notify          = require("gulp-notify")
    stripCssComments= require('gulp-strip-css-comments')
    rename          = require("gulp-rename")
    runSequence     = require('run-sequence')
    file            = require('gulp-file');


/* -------  Configuration ------- */

var paths = {
    
    html: '../project/',
    styles: {
        scss: '../project/!dev-scss/',
        css: '../project/css/'
    },
    images: {
        source: '../project/!dev-images/',
        produce: '../project/images/'
    }

};
var spriteConfig = {
    png: {
        imgName: 'sprite.png',
        cssName: '_sprite-png.scss',
        cssFormat: 'scss',
        imgPath: '../images/sprite.png',
        algorithm: 'binary-tree',
        cssVarMap: function(sprite) {
            sprite.name = 's-' + sprite.name
        }
    },
    svg: {
        shape: {
            spacing: {
                padding: 3
            }
        },
        mode: {
            view: {
                dest: './',
                bust: false,
                prefix: '.s-',
                dimensions: "-size",
                sprite: '../../images/sprite.svg', /* path releative from _sprite-svg.scss */
                render: {
                    scss: {
                        dest: '_sprite-svg.scss',
                        template: "template.mst"
                    }
                }
            }
        }
    }
};


/* ------- Gulp Tasks ------- */

gulp.task('serve', function() {
    browserSync.init({
        server: "../project"
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.styles.scss + '*.scss', ['sass']);
    gulp.watch(paths.images.source + 'sprite-png/*.png', ['sprite-png']);
    gulp.watch(paths.images.source + 'sprite-svg/*.svg', ['sprite-svg']);
    gulp.watch(paths.images.source + '*', ['imgmin']);
    gulp.watch(paths.html + '*.html').on('change', browserSync.reload);
});
gulp.task('sass', function() {
    gulp.src(paths.styles.scss + '*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', function(err) {
            return notify().write(err);
        })
        .pipe(cmq())
        .pipe(autoprefixer())
        .pipe(minifyCSS({
            advanced: false
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(paths.styles.css))
        .pipe(notify("SCSS Compiled!"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('remove-comments', function () {
    return gulp.src(paths.styles.css + '*.css')
        .pipe(stripCssComments())
        .pipe(gulp.dest(paths.styles.css));
});

gulp.task('sprite-png', function () {
    file('_sprite-png.scss', '', { src: true }).pipe(gulp.dest(paths.styles.scss + 'components/'));
    var spriteData = gulp.src(paths.images.source + 'sprite-png/*.png')
        .pipe(spritesmith(spriteConfig.png));
    spriteData.img.pipe(gulp.dest(paths.images.produce));
    spriteData.css.pipe(gulp.dest(paths.styles.scss + 'components/'));
    return spriteData.pipe(notify("Sprite(png) is created"));
});

gulp.task('sprite-svg', function () {
    return gulp.src(paths.images.source + 'sprite-svg/*.svg')
        .pipe(svgSprite(spriteConfig.svg))
        .pipe(gulp.dest(paths.styles.scss + 'components/'))
        .pipe(notify("Sprite(svg) is created"));
});

gulp.task('imgmin', function () {
    return gulp.src([paths.images.source + '*.png', paths.images.source + '*.jpg', paths.images.source + '*.svg'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.images.produce))
        .pipe(notify("Image optimized"));;
});


/* ------- Main Gulp Tasks ------- */

gulp.task('default', function() {
    runSequence(['sprite-png', 'sprite-svg'], ['imgmin', 'sass'], 'serve', 'watch');
});
gulp.task('finish', ['remove-comments'], function(){
    gulp.src('/')
        .pipe(notify("Ready to commit"));
})
