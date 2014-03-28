# grunt-init-basic

> Basic boilerplate for new project based on grunt, bower, html5boilerplate and others.<br>
> Create a basic project include LESS, Browserify and jQuery.

[grunt-init]: http://gruntjs.com/project-scaffolding
[nodejs]: http://nodejs.org/
[grunt]: http://gruntjs.com/
[bower]: http://bower.io/

## Requirements
- [NodeJS][nodejs]
- [Grunt][grunt]
- [Bower][bower]

## Installation
If you haven't already done so, install [grunt-init][].

Once grunt-init is installed, place this template in your `~/.grunt-init/` directory. It's recommended that you use git to clone this template into that directory, as follows:

```
git clone https://github.com/actum/grunt-init-basic.git ~/.grunt-init/basic
```

_(Windows users, see [the documentation][grunt-init] for the correct destination directory path)_

## Usage

At the command-line, cd into an empty directory, run this command and follow the prompts.

```
grunt-init basic
```

You should now install project dependencies with:

```
npm instal && bower install
```

You should use `npm instal && bower install && grunt build` after each pull to refresh all dependencies and initialize app.

Before each commit run the build task to be shure the app is ok.

```
grunt build
```

After that, you may execute project tasks with grunt.

```
grunt css       // compile LESS
grunt js        // lint js files, compile js templates
grunt build     // build project with Browserify
grunt           // run watch task for compile LESS, compile js templates and lint js files
```

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._
