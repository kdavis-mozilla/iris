/* global WaveSurfer:true*/
/**
 * Main entry point.
 *
 * the DOM has been localized and the user sees it in their language.
 *
 * @class Main
 */
(function() {
  'use strict';
  if (!document.l10n) {
    console.log('mock l10n api for test');
    document.l10n = {
      ready: new Promise(function(resolve) {
        return resolve();
      })
    };
  }

  var App = {
    init: function() {
      document.body.classList.remove('hidden');

      // Initialize WaveSurfer
      this.initWaveSurfer();
    },

    initWaveSurfer: function() {
      // Create WaveSurfer instance
      this.wavesurfer = Object.create(WaveSurfer);

      // Create WaveSurfer options
      var options = {
        container: '#waveform',
        waveColor: 'red',
        interact: false,
        cursorWidth: 0,
        barWidth: 5,
        hideScrollbar: true,
        height: 250
      };

      // Obtain micBtn
      var micBtn = document.querySelector('#micBtn');

      // Init wavesurfer
      this.wavesurfer.init(options);

      // Init Microphone plugin
      var microphone = Object.create(WaveSurfer.Microphone);
      microphone.init({
        wavesurfer: this.wavesurfer
      });
      microphone.on('deviceReady', function() {
        console.info('Device ready!');
      });
      microphone.on('deviceError', function(code) {
        console.warn('Device error: ' + code);
      });

      // start/stop mic on button click
      micBtn.onclick = function() {
        if (microphone.active) {
          microphone.stop();
        } else {
          microphone.start();
        }
      };
    }
  };

  document.l10n.ready.then(function() {
    App.init();
  });
}());
