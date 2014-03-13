/**
Compilacao e Minificacao automatica de arquivos estaticos e autoreload do Browser,
procurando seguir todas boas praticas.

Ex.:
If You change files in:

src/coffee/[some-folder]/<file-a>.coffe
src/coffee/[another-folder]/<file-b>.coffe
... and
src/less/[best-folder]/<file-c>.less
src/less/[amazing-folder]/<file-d>.less

... do make auto compile, generating:

js/[some-folder]/<file-a>.js
js/[another-folder]/<file-b>.js
...and
css/[best-folder]/<file-c>.js
css/[amazing-folder]/<file-d>.js

... in sequence, this be unified and minified (all in one file JS and other CSS):

js/one-script.min.js
css/one-style.min.css

and is in this point (in js/ and css/ root) whith make a live-reload in a browser.

**/

var PATH_STATIC = '../static/';

var PATH_COFFEE = PATH_STATIC + 'src/coffee/';
var PATH_LESS = PATH_STATIC + 'src/less/';

var PATH_JS = PATH_STATIC + 'js/';
var PATH_CSS = PATH_STATIC + 'css/';
var PATH_PARTIALS = PATH_STATIC + 'partials/';
var PATH_DJANGO_TEMPLATES = '../app/templates/';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      /** Compilers **/

      // Coffeescript.
      scripts: {
        files: PATH_COFFEE + '*/*.coffee',
        tasks: [ 'scripts' ],
      },
      // LESS in css path.
      css: {
        files: PATH_LESS + '*/*.less',
        tasks: [ 'css' ],
      },

      /** Live Reloads **/

      //Html: Django e Angular.
      html_reload: {
        files: [
          PATH_STATIC + 'partials/*.html',
          PATH_DJANGO_TEMPLATES + '**/*.html'
        ],
        options: {
            livereload: true
        },
      },
      // CSS - Reload changes in CSS Path
      css_reload: {
        files: PATH_CSS + '*.css',
        options: {
          livereload: true,
        },
      },
      // JS - Reload changes in JS Path
      js_reload: {
        files: PATH_JS + '*.js',
        options: {
          livereload: true,
        },
      },
    }, // Fim Whatch

    /**** Compilers and Minifiers ****/

    /** Javascripts **/

    // Compiles Coffescript to JS - before be minified
    coffee: {
      toCSS: {
        expand: true,
        flatten: false,
        cwd: PATH_COFFEE,
        src: [
          '*/*.coffee',
        ],
        dest: PATH_JS,
        ext: '.js'
      },
    },
    // Unify Angular into tmp.
    ngmin: {
      angular: {
        src: [
          PATH_JS + 'app/*.js',
          PATH_JS + 'controllers/*.js',
          PATH_JS + 'services/*.js',
        ],
        dest: '../static/js/tmp/all-controllers.ng.js'
      },
    },
    // Minify and Unify Javascript into JS Path.
    uglify: {
      options: {
        mangle: false
      },
      jsAngular: {
        files: {
          '../static/js/all-controllers.min.js': [PATH_JS + 'tmp/all-controllers.ng.js']
        }
      }
    },
    /** Styles **/
    less: {
      development: {
        files: [{
          expand: true,
          flatten: false,
          cwd: PATH_LESS,
          src: ['*/*.less'],
          dest: PATH_CSS,
          ext: '.css'
        }
      ]}
    },
    // Min CSS. Send to CSS Path
    cssmin: {
      build: {
        files: {
          '../static/css/all-styles.min.css': [ PATH_CSS + '*/*.css' ]
        }
      }
    },

  });

  // Plugins uses.
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Task default
  grunt.registerTask('default', [ 'watch' ]);

  grunt.registerTask('scripts', function() {

    grunt.log.writeln('1 - Compile COFFEE to JS...');
    grunt.task.run('coffee');

    grunt.log.writeln('2 - Unify Angular...');
    grunt.task.run('ngmin');

    grunt.log.writeln('3 - Minify Javascript...');
    grunt.task.run('uglify');
    // Or:
    // grunt.task.run(['bar', 'baz']);
  });

  grunt.registerTask('css', function() {

    grunt.log.writeln('1 - Compile LESS to CSS...');
    grunt.task.run('less');

    grunt.log.writeln('2 - Minife e Unifing CSS ...');
    grunt.task.run('cssmin');
  });
 };
