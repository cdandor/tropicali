const { series, watch, src, dest } = require("gulp")
//css
const postCSS = require("gulp-postcss")
const cleanCSS = require("gulp-clean-css")
const sourcemaps = require("gulp-sourcemaps")
//browser testing
const browserSync = require("browser-sync").create()
//image resizing
const imagemin = require("gulp-imagemin")
//github pages
const ghpages = require("gh-pages")

const concat = require("gulp-concat")

function compileCss() {
  return src([
    "src/css/reset.css",
    "src/css/typography.css",
    "src/css/styles.css",
  ])
    .pipe(sourcemaps.init())
    .pipe(
      postCSS([
        require("autoprefixer"),
        require("postcss-preset-env")({
          stage: 1,
          browsers: ["IE 11", "last 2 versions"],
        }),
      ])
    )
    .pipe(concat("styles.css"))
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
  watch("src/css/*", compileCss)
  watch("src/fonts/*", copyFonts)
  watch("src/img/*", copyImages)
}
async function deploy() {
  ghpages.publish("dist")
}
exports.deploy = deploy

exports.default = series(
  copyHtml,
  compileCss,
  copyFonts,
  copyImages,
  startWatch
)
