![project logo](https://github.com/kdavis-mozilla/iris/blob/master/public/style/icons/icon128.png)

# iris

Demo WebApp using [kaldi](http://kaldi-asr.org/) DNN STT along with [api.ai](https://api.ai/).

This is a demo webapp that uses a server based [kaldi](http://kaldi-asr.org/) deep neural network speech-to-text engine to convert speech to text.

## Rapid, but not Quick, Setup

### Setting up iris

1. Install [node.js](http://www.nodejs.org) or [io.js](https://iojs.org/en/index.html)
2. Install useful command-line tools globally:

    ```
    $ npm install -g bower karma
    ```
    
   To fetch dependent packages, enter the iris folder and run
   
    ```
    $ npm install
    ```
    
   To bind the git pre-commit code style check, run command:
   
    ```
    $ gulp githooks
    ```
    
   Now you are all set. The above instructions only need to be executed once.
   
3. If you are edit code, run command:

    ```
    $ gulp test
    ```
    
   To automaticly monitor and trigger all test when you change the code.

### Setting up Kaldi

In this section we will explain how to start up a [kaldi](http://kaldi-asr.org/) deep neural network server.

#### Starting an EC2 instance

The [kaldi](http://kaldi-asr.org/) server is based off of the Amazon AMI __kaldi-dnn__. This image employs the [kaldi](http://kaldi-asr.org/) DNN engine and a model trained off of the [TED-LIUM Corpus](http://www-lium.univ-lemans.fr/en/content/ted-lium-corpus).

The arcitecture of the [kaldi](http://kaldi-asr.org/) server calls for a single master node and one, or more, worker nodes. A worker node may be on the same physical hardware as the master, or can be located on another physical node. As we want to keep things simple in this demo we will have a master node and four worker nodes all on the same physical hardware. To simplify setup, the master node and four worker nodes will be started on boot when using the Amazon AMI __kaldi-dnn__.

So, to start a [kaldi](http://kaldi-asr.org/) server, one starts an EC2 instance based on the AMI __kaldi-dnn__. This instance should have an [NVIDIA](www.nvidia.com) GPU, as the deep neural network employs [CUDA](http://www.nvidia.com/object/cuda_home_new.html). Furthermore, this instance should be accessable via port 8888, which can be accomplished through configuration of its security group. A reasonable instance type to choose is __g2.2xlarge__.

## General Info

### Key Technologies

* **Bower** - For library and app dependency management.
* **npm** - For build-time dependency management.
* **gulp** - For building, packaging, and workflow.
* **Babel** - So we can leverage es6 modules and classes today.
* **CssNext** - So we can leverage new CSS specs today.

### What kind of web apps does iris support?

* **static hosting** web app
* **dynamic** web app with node.js/express backend
* **packaged** web app for Firefox Marketplace or Chrome Store
* **cordova/phonegap** for multiple platform native app

To build the deployable web app, run command:

  ```
  $ npm run static|dynamic|pack|cordova|github
  ```

   Choose one of the above [npm command](https://github.com/kdavis-mozilla/iris/blob/master/package.json) based on your needs.

### Tools Used:

__Package Management__
- [npm](https://www.npmjs.com/) Node Package manager
- [bower](http://bower.io/) Libraries manager

__Build__
- [gulp](http://gulpjs.com/) Javascript build system

-  __Transpiler__
  - [Babel](https://babeljs.io) (ES6)
  - [Cssnext](http://cssnext.io/) (CSS)

- __Optimize__
  - [UglifyJS](https://github.com/mishoo/UglifyJS) javascript Compressor
  - [cssmin](https://github.com/murphydanger/gulp-minify-css) Compress CSS files
  - [htmlmin](https://github.com/murphydanger/gulp-minify-html)  Minify HTML

- __Code Quality & Analysis__
  - [eslint](http://eshint.org/) javascript linting utility
  - [csslint](https://github.com/CSSLint/csslint) css code style linter
  - [jsonlint] (https://github.com/rogeriopvl/gulp-jsonlint) json linter
  - [sloc](https://github.com/oddjobsman/gulp-sloc) Source line of codes
  - [jsdoc](http://usejsdoc.org/) Generate API document by running [documentationjs](http://documentation.js.org/)

__Test__
- [Karma](http://karma-runner.github.io) test runner
- [Mocha](http://mochajs.org/) test framework
  - [Chai](http://chaijs.com/) assertion library
  - [Sinon](http://sinonjs.org/) test spies, stubs and mocks

__Server__
- [Express](http://expressjs.com/)
  - [Swig](http://paularmstrong.github.io/swig/) JavaScript Template Engine

__Client side libraries__
- [l20n](http://l20n.org/) client side internationalization
- [Bootstrap](http://getbootstrap.com) mobile first front-end framework
  - [Bootstrap Material Design](https://github.com/FezVrasta/bootstrap-material-design) material design theme for Bootstrap

- __Browser polyfill__
  - [localforage](https://github.com/mozilla/localForage) enhanced offline storage API
  - [fetch](https://github.com/github/fetch) replacement of XMLHTTPRequest

- __Commincation with the Kaldi Server__
  - [dictatemp3.js](https://github.com/kdavis-mozilla/dictatemp3.js) STT using the kaldi-gstreamer-server

- __Question Answering__
  - [api-ai-javascript](https://github.com/api-ai/api-ai-javascript) Question answering using the api-ai server

### License

[The MIT License](http://opensource.org/licenses/MIT)

## Credit

Developers and designers from node.js, bower, express, gulp, Firefox OS, and people who involved in improving Web technologies.
