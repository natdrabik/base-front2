// generated on 2018-11-19 using generator-webapp 3.0.1
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');

const es = require('event-stream');
const runSequence = require('run-sequence');
const globby = require('globby');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const path = require('path');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const lazypipe = require('lazypipe');

const flexibility = require('postcss-flexibility');
const flexbugs = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');
const pixrem = require('pixrem');

const uglifyjs = require('uglify-es');
const composer = require('gulp-uglify/composer');
const minify = composer(uglifyjs, console);

const log = require('fancy-log');
const colors = require('ansi-colors');

// Version Control
const fs = require('fs');
const getPackageJson = function () { return JSON.parse(fs.readFileSync('./package.json', 'utf8')); };
const rev = require('git-rev');

let dev = true;

function setDevToFalse() {
  return new Promise(resolve => {
    dev = false;
    resolve();
  });
}

gulp.task('views', () => {
  return gulp.src(['app/views/*.pug'])
    .pipe($.plumber())
    .pipe($.pug({
      pretty: true
    }))
    .pipe(gulp.dest('.tmp'))
    .pipe(reload({stream: true}));
});

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      errLogToConsole: true,
      includePaths: ['.', '../../node_modules']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer(),
      mqpacker(),
      flexbugs(),
      flexibility()
    ]))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  function onError(err) {
    log(colors.green(err.message));
    this.emit('end');
  };

  let b = browserify({
    entries: 'app/scripts/main.js',
    transform: babelify,
    debug: true
  })

  return b.bundle()
    .on('error', onError)
    .pipe(source(path.posix.basename('main.js')))
    .pipe($.plumber())
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({ stream: true }))
});

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('compile', () => {
  const jsPipe = lazypipe()
    .pipe($.sourcemaps.init, {loadMaps: true})
    .pipe(minify, {compress: {drop_console: false}, mangle: true})
    .pipe($.sourcemaps.write, '.');

  const cssPipe = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.postcss, [cssnano({safe: true, autoprefixer: false}), pixrem({rootValue: 10, atrules: true}), flexibility()])
    .pipe($.sourcemaps.write, '.')

  gulp.src('.tmp/index.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.css$/, cssPipe()))
    .pipe($.if(/\.js$/, jsPipe()))
    // .pipe($.debug())
    .pipe(gulp.dest('dist'));

  return gulp.src(['!.tmp/index.html', '.tmp/*.html'])
    .pipe($.useref({
      noAssets: true,
      searchPath: ['.tmp', 'app', '.']
    }))
    .pipe($.rename((path) => {
      path.dirname = `/${path.basename}`,
      path.basename = 'index'
    }))
    // .pipe($.debug())
    .pipe(gulp.dest('dist'));
});

gulp.task('html', gulp.series('views', gulp.parallel('styles', 'scripts'), 'compile'));

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src('**/*.{eot,svg,ttf,woff,woff2}')
    // .concat('app/fonts/**/*')
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  gulp.src('app/fonts/*')
    .pipe(gulp.dest('dist/fonts'));

  gulp.src('app/json/**/*')
    .pipe(gulp.dest('dist/json'));

  return gulp.src([
    'app/*.*',
    '!app/**/*.html',
    '!app/**/*.pug'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('clean:dist', del.bind(null, ['dist']));

gulp.task('serve', gulp.series(['clean'], ['views'], gulp.parallel(['styles', 'scripts', 'fonts']), function watch() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
        '/node_modules': 'node_modules'
      },
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/views/**/*.pug', gulp.parallel(['views']));
  gulp.watch('app/styles/**/*.scss', gulp.parallel(['styles']));
  gulp.watch('app/scripts/**/*.js', gulp.parallel(['scripts']));
  gulp.watch('app/fonts/**/*', gulp.parallel(['fonts']));
}));

gulp.task('calculateSize', () => {
  return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('build', gulp.series('clean:dist', gulp.parallel('lint', 'html', 'images', 'fonts', 'extras'), 'calculateSize'));

gulp.task('default', gulp.series(setDevToFalse, 'clean', 'build'));

gulp.task('serve:default', () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:dist', gulp.series('default', 'serve:default'));

gulp.task('zip', () => {
  const pkg = getPackageJson();
  return new Promise(resolve => {
    rev.short(str => {
      if (!str) str = Date.now();

      resolve(gulp.src('dist/**')
        .pipe($.zip(`${pkg.name || 'dist'}_${pkg.version || ''}.zip`))
        .pipe(gulp.dest(__dirname)));
    })
  })
});

gulp.task('build:zip', gulp.series(setDevToFalse, 'clean', 'build', 'zip'));

function bump(version = 'patch') {
  return gulp.src('./package.json')
    .pipe($.bump({type: version}))
    .pipe(gulp.dest('./'));
}

gulp.task('bump:patch', () => { return bump('patch'); });
gulp.task('bump:minor', () => { return bump('minor'); });
gulp.task('bump:major', () => { return bump('major'); });

// function build(bump = 'bump:patch') {
//   return new Promise(resolve => {
//     dev = false;
//     runSequence(bump, 'build:zip', resolve);
//   });
// }

gulp.task('build:patch', gulp.series('bump:patch', setDevToFalse, 'build:zip'));
gulp.task('build:minor', gulp.series('bump:minor', setDevToFalse, 'build:zip'));
gulp.task('build:major', gulp.series('bump:major', setDevToFalse, 'build:zip'));
