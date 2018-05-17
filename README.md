# gulp-colorfulkits:lollipop: [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
Make gulp log colorful  
[![NPM](https://nodei.co/npm/gulp-colorfulkits.png)](https://nodei.co/npm/gulp-colorfulkits/)  

## Usage
```sh
npm i --save-dev github:mochiya98/gulp-colorfulkits#master
```
```javascript
const {
  colorful,
  gulpColorfulEslint,
  gulpWatchColorful,
  watchColorful,
} = require("gulp-colorfulkits");
```

## colorful(options)
```javascript
gulp.src('./src/*.js')
  .pipe(colorful())//Output Colorful DestLog
  .pipe(gulp.dest('./dest/'));
```
#### [object]options = {color, cwd, indent}
- [string]color
  - [ansi-colors](https://github.com/doowb/ansi-colors) text-color enum
  - default:`cyan`
- [string]cwd
  - [vinyl](https://github.com/gulpjs/vinyl) cwd
  - default:`.`
- [integer]indent
  - indent-level
  - default:`1`

## colorful.preset(options);
```javascript
const customColorful = colorful.preset({color:"green"});
gulp.src('./src/**/*.js')
  .pipe(customColorful())
  .pipe(gulp.dest('./dest/'));
```
#### [object]options
same

## gulpColorfulEslint()
```javascript
gulp.src('./src/**/*.js')
  .pipe(gulpColorfulEslint())
  //like .pipe(eslint()).pipe(eslint.result())
```

## gulpWatchColorful(glob, callback, options)
```javascript
gulpWatchColorful("./src/**/*.js",function(){
  //callback
});
//like gulp.watch(glob,callback)
```
- [string]glob
  - [glob]([https://github.com/isaacs/node-glob)
- [function]callback
  - called when file changed.
- [object]options
  - [boolean]ignoreDirectoryEvents
    - default `true`


## watchColorful(glob)
```javascript
watchColorful("./src/**/*.js")
  .pipe(gulp.dest("./dest/"));
//like require("gulp-watch")(glob)
```
- [string]glob
  - [glob]([https://github.com/isaacs/node-glob)

