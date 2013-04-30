module.exports = function(grunt) {
  grunt.initConfig({
    info: grunt.file.readJSON('bower.json'),
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/\n'
    },
    jshint: {
      main: [
        'grunt.js', 
        'bower.json',
        'lib/**/*.js',
        'test/*.js'
      ]
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: [
          'components/fidel/dist/fidel.js',
          'lib/hoverhero.js'
        ],
        dest: 'dist/hoverhero.js'
      },
      fidel: {
        src: 'lib/hoverhero.js',
        dest: 'dist/fidel.hoverhero.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'dist/hoverhero.js',
        dest: 'dist/hoverhero.min.js'
      },
      fidel: {
        src: 'dist/fidel.hoverhero.js',
        dest: 'dist/fidel.hoverhero.min.js'
      }
    },
    less: {
      styles: {
        files: {
          'dist/hoverhero.css': 'lib/hoverhero.less'
        }
      }
    },
    watch: {
      scripts: {
        files: [
          '<%= jshint.main %>',
          'test/index.html'
        ],
        tasks: ['scripts', 'mocha']
      },
      styles: {
        files: 'lib/*.less',
        tasks: ['styles']
      }
    },
    mocha: {
      all: {
        src: 'test/index.html',
        options: {
          run: true
        }
      }
    },
    plato: {
      main: {
        files: {
          'reports': ['lib/*.js']
        }
      }
    },
    reloadr: {
      main: [
        'example/*',
        'test/*',
        'dist/*'
      ]
    },
    connect: {
      server:{
        port: 8000,
        base: '.'
      },
      plato: {
        port: 8000,
        base: 'reports',
        options: {
          keepalive: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.loadNpmTasks('grunt-plato');
  grunt.registerTask('default', ['styles', 'scripts', 'mocha']);
  grunt.registerTask('scripts', [ 'jshint', 'concat', 'uglify']);
  grunt.registerTask('styles', ['less']);
  grunt.registerTask('dev', ['connect:server', 'reloadr', 'watch']);
  grunt.registerTask('ci', ['connect:server', 'watch:scripts']);
  grunt.registerTask('reports', ['plato', 'connect:plato']);
};
