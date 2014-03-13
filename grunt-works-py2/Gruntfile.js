var PATH = "./"
var PROJECT_NAME = "tests-django"
var PATH_SRC = PATH + "tests-django/"
var PATH_DEST = PATH + "heroku-tests-django/"
var PATH_CONFIGS = PATH_SRC + 'builds/heroku-configs/'
var PATH_STATIC = PATH_SRC + 'static/'

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    // Copy / Replace all folders / files
    copy: {
      main: {
        nonull: true,
        files: [
          {
            expand: true,
            src: [
              //Copy recursively Project Path
              PATH_SRC + '**/*', PATH_SRC + '**/.*',

              /*** Ignore ***/
              // Builds
              '!' + PATH_SRC + 'builds/**', '!' + PATH_SRC + 'builds/**/.*',
              // Sources
              '!' + PATH_STATIC + 'src/**', '!' + PATH_STATIC + 'src/**/.*',
              // Tmp - Ps. Would deploy CSS and JS containing in root folder
              '!' + PATH_STATIC + 'css/*/**',
              '!' + PATH_STATIC + 'js/*/**',
              /**************/

            ],
             dest: PATH_DEST
           },
           // Replace config files to way of Heroku
          {src: [PATH_CONFIGS + 'manage-heroku.py'], dest: PATH_DEST + PROJECT_NAME + '/manage.py'},
          {src: [PATH_CONFIGS + 'settings-heroku.py'], dest: PATH_DEST + PROJECT_NAME + '/project/settings.py'},
          {src: [PATH_CONFIGS + 'wsgi-heroku.py'], dest: PATH_DEST + PROJECT_NAME + '/project/wsgi.py'},

        ],
      }
    },

    shell: {
      removePyc: {
        options: {
            stdout: true
        },
        command: "cd " + PATH_SRC + "&& find . -name '*.pyc' -delete;"
      },

      // gitInit: {
      //   options: {
      //       stdout: true
      //   },
      //   command: 'cp -r ' + PATH_SRC + '/.git ' + PATH_DEST + PROJECT_NAME + '/'
      // },

      gitInit: {
        options: {
            stdout: true
        },
        command: 'cd ' + PATH_DEST + PROJECT_NAME + '/ && git init; cd -'
      },
      gitAdd: {
        options: {
            stdout: true
        },
        command: 'cd ' + PATH_DEST + PROJECT_NAME + '/ && git add --all; cd -'
      },
      gitCommit: {
        options: {
            stdout: true
        },
        command: 'cd ' + PATH_DEST + PROJECT_NAME + '/ && git commit -m "Auto Commit"; cd -'
      },
      gitRemoteAddHeroku: {
        options: {
            stdout: true
        },
        command: 'cd ' + PATH_DEST + PROJECT_NAME + '/ && git remote add heroku git@heroku.com:tests-django.git; cd -'
      },
      gitPushHerokuMaster: {
        options: {
            stdout: true
        },
        command: 'cd ' + PATH_DEST + PROJECT_NAME + '/ && git push -f heroku master; cd -'
      },
    },

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Task(s).
  //Constroi projeto pronto pra fazer Deploy no Heroku
  grunt.registerTask('create','Cria projeto Heroku',  ['shell:removePyc', 'copy']);

  grunt.registerTask('rm-pyc', 'Remove arquivos .pyc', ['shell:removePyc']);

  grunt.registerTask('deploy', 'Realiza Deploy no Heroku', function() {

    grunt.log.writeln('1 - git init');
    grunt.task.run('shell');

    grunt.log.writeln('2 - git add');
    grunt.task.run('shell:gitAdd');

    grunt.log.writeln('3 - git commit');
    grunt.task.run('shell:gitCommit');

    grunt.log.writeln('4 - git remote add heroku git@heroku.com:tests-django.git');
    grunt.task.run('shell:gitRemoteAddHeroku');

    grunt.log.writeln('5 - git push heroku master');
    grunt.task.run('shell:gitPushHerokuMaster');

    // Or:
    // grunt.task.run(['bar', 'baz']);
  });



};
