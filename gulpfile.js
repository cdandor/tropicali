const { series, watch, src, dest } = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const cleanCSS = require("gulp-clean-css")
const sourcemaps = require("gulp-sourcemaps")
const browserSync = require("browser-sync").create()
const imagemin = require("gulp-imagemin")

function compileSass() {
  return src("src/css/styles.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream())
}

function copyHtml() {
  return src("src/*.html").pipe(dest("dist"))
}

function copyFonts() {
  return src("src/fonts/*").pipe(dest("dist/fonts"))
}

function copyImages() {
  return src("src/img/*").pipe(imagemin()).pipe(dest("dist/img"))
}

function startWatch() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  })

  watch("src/*.html", copyHtml).on("change", browserSync.reload)
  watch("src/css/styles.scss", compileSass)
  watch("src/fonts/*", copyFonts)
  watch("src/img/*", copyImages)
}

exports.default = series(
  copyHtml,
  compileSass,
  copyFonts,
  copyImages,
  startWatch
)
