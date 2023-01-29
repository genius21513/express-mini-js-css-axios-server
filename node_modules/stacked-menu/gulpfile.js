const gulp          = require('gulp')
const browserSync   = require('browser-sync').create()
const reload        = browserSync.reload
const del           = require('del')
const rename        = require('gulp-rename')
const sass          = require('gulp-sass')
const postcss       = require('gulp-postcss')
const cssnano       = require('cssnano')
const autoprefixer  = require('autoprefixer')
const sorter        = require('css-declaration-sorter')
const sourcemaps    = require('gulp-sourcemaps')
const rollup        = require('gulp-better-rollup')
const buble         = require('rollup-plugin-buble')
const eslint        = require('rollup-plugin-eslint')
const uglify        = require('rollup-plugin-uglify-es')
const cleanup       = require('rollup-plugin-cleanup')
const zip           = require('gulp-zip')
const pkg           = require('./package.json')

const processors = [
  autoprefixer({
    browsers: [
      'Chrome >= 20',
      'Firefox >= 24',
      'Edge >= 12',
      'Explorer >= 9',
      'iOS >= 6',
      'Safari >= 6',
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12'
    ]
  }),
  sorter({order: 'concentric-css'})
]
const nano = [
  cssnano({
    discardComments: {
      removeAll: true
    },
    zindex:false
  })
]
const snakeToCap = function(str) {
  return str.replace(/\-\w/g, function(sub) {
    return sub[1].toUpperCase()
  })
  .replace(str.charAt(0), str.charAt(0).toUpperCase())
}
const banner = '/**'
  + '\n* ' + snakeToCap(pkg.name) + ' v' + pkg.version
  + '\n* ' + pkg.description
  + '\n* Author: ' + pkg.author
  + '\n*'
  + '\n* ' + pkg.homepage
  + '\n*'
  + '\n* Copyright ' + pkg.license
  + '\n**/\n'
const footer = '/* Touch me on Twitter! @stilearningTwit */'


/**
 * Builds
 * ================================================================
 */

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () =>
  gulp.src('src/scss/' + pkg.name + '.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream({match: '**/*.css'}))
)

gulp.task('sass-uglify', () =>
  gulp.src('src/scss/' + pkg.name + '.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(postcss(nano))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream({match: '**/*.css'}))
)

gulp.task('sassDemo', () =>
  gulp.src('demo/assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(postcss(nano))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('demo/assets/css'))
    .pipe(browserSync.stream({match: '**/*.css'}))
)

// process JS files.
gulp.task('js', () =>
  gulp.src(`src/scripts/${pkg.name}.js`)
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [
        eslint(),
        buble(),
        cleanup({
          comments: ['srcmaps'],
          normalizeEols: 'unix',
          maxEmptyLines: 1
        })
      ]
    }, {
      format: 'iife',
      name: snakeToCap(pkg.name),
      banner: banner,
      footer: footer,
      sourceMap: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
)

gulp.task('js-uglify', () =>
  gulp.src(`src/scripts/${pkg.name}.js`)
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [
        eslint(),
        buble(),
        uglify({
          output: {quote_style: 1}
        })
      ]
    }, {
      format: 'iife',
      name: snakeToCap(pkg.name),
      banner: banner,
      footer: footer,
      sourceMap: true
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
)

// Copy assets
gulp.task('copy', (done) => {
  const bridges = 'src/scripts/' + pkg.name + '.jquery.js'

  // dist
  gulp.src('src/scss/*.scss')
    .pipe(gulp.dest('dist/scss'))

  gulp.src(bridges)
    .pipe(gulp.dest('dist/js'))

  // demo
  gulp.src([
      bridges,
      'dist/js/*'
    ])
    .pipe(gulp.dest('demo/assets/js'))

  gulp.src('dist/css/*')
    .pipe(gulp.dest('demo/assets/css'))

  done()
})

// Clean up build files
gulp.task('clean', del.bind(null, [
    `releases/${pkg.name}-v${pkg.version}.zip`,
    'dist',
    'demo/assets/css',
    'demo/assets/js/**',
    '!demo/assets/js',
    '!demo/assets/js/demo.js'
  ])
)

gulp.task('build', gulp.series('sass', 'sass-uglify', 'sassDemo', 'js', 'js-uglify', 'copy'))

gulp.task('tag', () =>
  gulp.src([
      'README.md',
      'CHANGELOG.md',
      'demo/**/*',
      'dist/**/*',
      'docs/' + pkg.name + '/' + pkg.version + '/**/*'
    ], {
      base: '.'
    })
    .pipe(zip(pkg.name + '-v' + pkg.version + '.zip'))
    .pipe(gulp.dest('releases/'))
)

gulp.task('release', gulp.series('build', 'tag'))


// Static Server + watching scss/html files
gulp.task('serve', (done) => {
  browserSync.init({
    server: './demo',
    port: 3002
  })

  done()

  gulp.watch('src/scss/*.scss', gulp.series('sass', 'sass-uglify', 'sassDemo', 'copy'))
  gulp.watch('demo/assets/scss/*.scss', gulp.series('sassDemo'))
  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch([
      'src/scripts/*.js', 'demo/assets/js/demo.js'
    ], gulp.series('copy', 'js', 'js-uglify', reload))
  gulp.watch('demo/*.html').on('change', reload)
})

// Serve the docs
gulp.task('serve:docs', () =>
  browserSync.init({
    server: './docs/' + pkg.name + '/' + pkg.version,
    port: 5002
  })
)

gulp.task('serve:release', gulp.series('release', 'serve'))
gulp.task('default', gulp.series('build', 'serve'))