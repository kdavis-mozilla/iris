/*jshint node: true */
/*global module, process */
'use strict';

module.exports.tasks = {
  // pkg: grunt.file.readJSON('package.json'),
  // Project settings
  config: {
    src: 'public',
    build: 'build',
    tmp: '.tmp',
    dst: 'dist',
    pack: 'pack'
  },
  express: {
    options: {
      port: 8000
    },
    dev: {
      options: {
        script: 'server.js'
      }
    },
    prod: {
      options: {
        script: 'server.js',
        node_env: 'production'
      }
    },
    test: {
      options: {
        script: 'server.js'
      }
    }
  },
  watch: {
    express: {
      files: ['server.js', '<%= config.src %>/js/**/*.js', 'routes/**/*.js'],
      tasks: ['express:dev'],
      options: {
        livereload: true, //reloads the browser
        spawn: false
      }
    }
  },
  karma: {
    unit: {
      configFile: 'karma.conf.js'
    }
  },
  mochacov: {
    test: {
      options: {
        reporter: 'spec'
      }
    },
    coverage: {
      options: {
        reporter: 'html-cov',
        output: '<%= config.src %>/test/coverage.html'
      }
    },
    travis: {
      options: {
        coveralls: {
          serviceName: 'travis-ci',
          serviceJobId: process.env.TRAVIS_JOB_ID,
          repoToken: '9Lqs288pJNb4aYw10BdWnjdJ5Vbx1zZM7'
        }
      }
    },
    options: {
      files: ['<%= config.src %>/test/unit/**_test.js'],
      ui: 'tdd'
    }
  },
  mocha_phantomjs: {
    all: ['<%= config.src %>/test/index.html']
  },
  vulcanize: {
    default: {
      options: {
        csp: true,
        inline: false,
        strip: false
      },
      files: {
        '<%= config.build %>/index-csp.html': '<%= config.build %>/index.html'
      }
    }
  },
  htmlmin: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%= config.src %>',
        src: ['{,*/}*.html'],
        dest: '<%= config.dst %>'
      }]
    }
  },
  // Reads HTML for usemin blocks to enable smart builds
  // that automatically concat, minify and revision files.
  // Creates configurations in memory so additional tasks
  // can operate on them
  useminPrepare: {
    options: {
      dest: '<%= config.dst %>'
    },
    html: ['<%= config.build %>/index.html']
  },
  // Performs rewrites based on rev and the useminPrepare configuration
  usemin: {
    options: {
      assetsDirs: ['<%= config.dst %>'],
      debugInfo: true
    },
    html: ['<%= config.dst %>/{,*/}*.html'],
    css: ['<%= config.dst %>/styles/{,*/}*.css']
  },
  manifest: {
    generate: {
      options: {
        basePath: './<%= config.dst %>/',
        // cache: ['js/server.js', 'css/style.css'],
        // cachePrefix: '/',
        // network: ['http://*', 'https://*'],
        fallback: ['/ fallback.html'],
        // exclude: ['js/jquery.min.js'],
        preferOnline: true,
        verbose: false,
        timestamp: true
      },
      src: [
        '*.html',
        'js/*.js',
        'style/*.css',
        'style/images/*.png',
        'style/images/*.jpg',
        'style/icons/*.ico',
        'style/icons/*.png'
      ],
      dest: '<%= config.dst %>/manifest.appcache'
    }
  },
  copy: {
    // Copies all files into build directory for vulcanization
    build: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= config.src %>',
        dest: '<%= config.build %>',
        src: ['**']
      }]
    },
    vulcanized: {
      options: {
        // move the csp js file into usemin block
        /*process: function (content, srcpath) {
          var useminComment = 'build:js js/app.min.js';
          function moveToUsemin(script) {
            // extract the csp js script line
            var cspStart = content.indexOf(script);
            if (cspStart > -1) {
              var cspEnd   = cspStart + script.length;
              var cspJs = content.slice(cspStart, cspEnd); // CR

              // cut it out
              content = content.substring(0, cspStart - 1)
                .concat(content.substring(cspEnd));

              // insert it into the usemin block
              var useminEnd = content.indexOf(useminComment) +
                useminComment.length; // next line
              if (useminEnd > -1) {
                content = content
                  .substring(0, useminEnd) // end of useminComment
                  .concat('\n',
                    cspJs, // insert
                    '\n',
                    content.substring(useminEnd + 1) // after end of useminComment
                  );
              }
            }
          }
          moveToUsemin('<script src="index-csp.js"></script>');
          moveToUsemin('<script defer src="vendor/polymer/polymer.js"></script>');
          moveToUsemin('<script defer src="vendor/platform/platform.js"></script>');
          return content;
        }*/
      },
      src: '<%= config.build %>/index-csp.html',
      dest: '<%= config.build %>/index.html'
    },
    static: {
      files: [{ /* copy manifests */
        expand: false,
        src: '<%= config.src %>/manifest.webapp',
        dest: '<%= config.dst %>/manifest.webapp'
      },
      {
        expand: false,
        src: '<%= config.src %>/manifest.json',
        dest: '<%= config.dst %>/manifest.json'
      },
      { /* copy icons */
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'style/icons/**/*',
        dest: '<%= config.dst %>/'
      },
      { /* copy images */
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'style/images/**/*',
        dest: '<%= config.dst %>/'
      },
      { /* copy locales */
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'locales/**/*',
        dest: '<%= config.dst %>/'
      }]
    },
    webComponent: {
      files: [{ /* copy vendor html and css */
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'vendor/**/*.html',
        dest: '<%= config.dst %>/'
      },
      {
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'vendor/**/*.css',
        dest: '<%= config.dst %>/'
      },
      { /* copy polymer and platform */
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'vendor/polymer/**/*',
        dest: '<%= config.dst %>/'
      },
      {
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'vendor/platform/**/*',
        dest: '<%= config.dst %>/'
      },
      {
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'parts/**/*',
        dest: '<%= config.dst %>/'
      }]
    },
    appcache: {
      files: [{
        expand: false,
        src: '<%= config.build %>/manifest.appcache',
        dest: '<%= config.dst %>/manifest.appcache'
      }]
    },
    backgroundJs: {
      files: [{
        expand: true,
        cwd: '<%= config.src %>/',
        src: 'js/background.js',
        dest: '<%= config.dst %>/'
      }]
    },
    installPage: {
      files: [{
        expand: true,
        cwd: 'helper/',
        src: 'install.html',
        dest: '<%= config.pack %>/'
      }]
    },
    backupFirefox: {
      files: [{
        expand: false,
        src: '<%= config.src %>/manifest.webapp',
        dest: '<%= config.src %>/manifest_webapp_backup'
      }]
    },
    firefox: {
      files: [{
        expand: false,
        src: '<%= config.src %>/manifest.webapp',
        dest: '<%= config.src %>/manifest.json'
      }]
    },
    backupChrome: {
      files: [{
        expand: false,
        src: '<%= config.src %>/manifest.json',
        dest: '<%= config.src %>/manifest_json_backup'
      }]
    },
    chrome: {
      files: [{
        expand: false,
        src: '<%= config.src %>/manifest.json',
        dest: '<%= config.src %>/manifest.webapp'
      }]
    }
  },
  zip: {
    pack: {
      cwd: '<%= config.dst %>/',
      src: '<%= config.dst %>/**',
      dest: '<%= config.pack %>/package.zip'
    }
  },
  clean: {
    dist: ['<%= config.dst %>/', '<%= config.tmp %>/',
    '<%= config.build %>/', '<%= config.pack %>/'],
    unvulcanized: ['<%= config.build %>/index.html'],
    vulcanized: ['<%= config.build %>/index-csp.html'],
    docs: ['docs/'],
    static: ['<%= config.dst %>/test'],
    pack: ['<%= config.dst %>/test']
  },
  jsdoc: {
    src: ['<%= config.src %>/js/*.js'],
    options: {
      destination: 'docs'
    }
  },
  jshint: {
    utils: {
      jshintrc: true,
      src: [
        '*.js',
        'tasks/**/*.js',
        'config/**/*.js'
      ]
    },
    server: {
      jshintrc: true,
      src: [
        'server.js',
        'routes/**/*.js'
      ]
    },
    client: {
      jshintrc: true,
      src: [
        '<%= config.src %>/**/*.js'
      ]
    }
  },
  jscs: {
    options: {
      config: '.jscsrc'
    },
    utils: {
      src: [
        '*.js',
        'tasks/**/*.js',
        'config/**/*.js'
      ]
    },
    server: {
      src: [
        'server.js',
        'routes/**/*.js'
      ]
    },
    client: {
      src: [
        '<%= config.src %>/**/*.js'
      ]
    }
  },
  jsonlint: {
    files: {
      src: [
        '<%= config.src %>/manifest.webapp',
        '<%= config.src %>/manifest.json',
        '<%= config.src %>/**/*.json'
      ]
    }
  },
  sloc: {
    client: {
      files: {
        './': [
          '<%= config.src %>/*.html',
          '<%= config.src %>/js/*.js',
          '<%= config.src %>/style/*.css',
          '<%= config.src %>/parts/**/*.html',
          '<%= config.src %>/parts/**/*.js',
          '<%= config.src %>/parts/**/*.css',
          '<%= config.src %>/test/unit/*.js'
        ]
      }
    },
    server: {
      files: {
        './': [
          'server.js',
          'routes/**/*.js',
          'views/**/*.html'
        ]
      }
    }
  },
  githooks: {
    all: {
      'pre-commit': 'lint'
    }
  },
  'gh-pages': {
    options: {
      base: '<%= config.dst %>'
    },
    src: ['**']
  }
};