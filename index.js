const fs = require("fs");
const path = require("path");
const {Transform} = require("stream");

const lazypipe = require("lazypipe");

const gulp = require("gulp");

const eslint = require("gulp-eslint");
const watch = require("gulp-watch");
const log = require("fancy-log");
const colors = require("ansi-colors");

const colorful = function(opts){
	if(!opts) opts = {};
	opts.color = opts.color || "cyan";
	opts.cwd = opts.cwd || ".";
	opts.indent = opts.indent === void 0 ? 1 : opts.indent;
	let indent = "  ".repeat(opts.indent);
	let transform = function(file, encoding, callback){
		if(file.isNull())return callback(null, file);
		let fp = opts.cwd
			? path.resolve(
				opts.cwd,
				path.relative(file.base, file.path)
			)
			: file.path;
		log(`${indent} -> ${colors.bold(colors[opts.color](fp))}`);
		this.push(file);
		return callback();
	};
	return new Transform({
		objectMode: true,
		transform,
	});
};
colorful.preset = function(opts){
	return function(){
		return colorful(opts);
	};
};

const gulpColorfulEslint = lazypipe()
	.pipe(eslint)
	.pipe(
		eslint.result,
		res => {
			log(
				colors.bold(colors.bgBlue(
					`ESLint: ${res.filePath}`
				))
			);
			if(res.messages.length === 0){
				log(colors.bold(colors.cyan("passed.")));
			}
			for(let msg of res.messages){
				log(
					colors.bold(colors[[null, "yellow", "red"][msg.severity]](
						`  ${msg.line}:${msg.column} ${msg.message} (${msg.ruleId})`
					))
				);
			}
		}
	);

const gulpWatchColorful = function(globPath, func, opts){
	if(!opts) opts = {};
	if(!opts.ignoreDirectoryEvents) opts.ignoreDirectoryEvents = true;
	let watcher = gulp.watch(globPath);
	watcher.on("all", function(event, filepath, stat){
		let fullpath = path.resolve(filepath);
		if(opts.ignoreDirectoryEvents && stat.isDirectory())return;
		log(colors.bold({
			"add"      : colors.magenta("add  "),
			"addDir"   : colors.magenta("add  "),
			"change"   : colors.yellow("change"),
			"unlink"   : colors.red("delete"),
			"unlinkDir": colors.red("delete"),
		}[event])
			+ ": "
			+ colors.bold(colors.green(fullpath)));
		func(event, fullpath, stat);
	});
	return watcher;
};

const watchColorful = function(...args){
	return watch(...args)
		.pipe(new Transform({
			objectMode: true,
			transform : function(evt, encoding, callback){
				if(evt.isNull())return callback(null, evt);
				log(colors.bold({
					"add"   : colors.magenta("add  "),
					"change": colors.yellow("change"),
					"unlink": colors.red("delete"),
				}[evt.event])
					+ ": "
					+ colors.bold(colors.green(evt.path)));
				this.push(evt);
				return callback();
			},
		}));
};

module.exports = {
	colorful, //.pipe(colorful());
	gulpColorfulEslint, //like .pipe(eslint).pipe(eslint.result)
	gulpWatchColorful, //like gulp.watch("glob",()=>{});
	watchColorful, //like require("gulp-watch")(...args);
};
