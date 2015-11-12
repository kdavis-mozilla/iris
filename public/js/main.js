/* global Dictate:true*/
/* global WaveSurfer:true*/
/* global Transcription:true*/
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

      // Initialize dictate.js
      var dictate = this.initDictate();

      // Initialize WaveSurfer
      this.initWaveSurfer(dictate);
    },

    initWaveSurfer: function(dictate) {
      // Create WaveSurfer instance
      var wavesurfer = Object.create(WaveSurfer);

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

      // Init wavesurfer
      wavesurfer.init(options);

      // Obtain dom elements
      var micBtn = document.querySelector('#micBtn');
      var textbox = document.querySelector('#textbox');

      // Init Microphone plugin
      var microphone = Object.create(WaveSurfer.Microphone);
      microphone.init({
        wavesurfer: wavesurfer
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
          dictate.stopListening();
        } else {
          microphone.start();
          textbox.innerHTML = '';
          dictate.startListening();
        }
      };
    },

    initDictate: function() {
      // Create Transcription to hold spoken text
      var tt = new Transcription();

      // Obtain dom elements
      var micBtn = document.querySelector('#micBtn');
      var textbox = document.querySelector('#textbox');

      // Create Dictate for speech-to-text
      var dictate = new Dictate({
        server: 'ws://bark.phon.ioc.ee:82/english/duplex-speech-api/ws/speech',
        serverStatus: 'ws://bark.phon.ioc.ee:82/english/duplex-speech-api/ws/status',
        recorderWorkerPath: 'vendor/dictate.js/lib/recorderWorker.js',
        onReadyForSpeech: function() {
          // Note: Called upon completion of dictate.startListening()
          micBtn.disabled = true;
          console.info('Ready for speech');
        },
        onEndOfSpeech: function() {
          micBtn.disabled = false;
          micBtn.click();
          console.info('End of speech');
        },
        onEndOfSession: function() {
          // TODO: Properly integrate this into the state machine
          if (micBtn.disabled) {
            micBtn.disabled = false;
            micBtn.click();
          }
          console.info('End of session');
        },
        onPartialResults: function(hypos) {
          // TODO: Generalize to the case where there are more results
          tt.add(hypos[0].transcript, false);
          console.info('onPartialResults: ' + tt.toString());
          textbox.innerHTML = tt.toString();
        },
        onResults: function(hypos) {
          // TODO: Generalize to the case where there are more results
          // TODO: Properly integrate this into the state machine
          tt.add(hypos[0].transcript, true);
          console.info('onResults: ' + tt.toString());
          textbox.innerHTML = tt.toString();
          tt = new Transcription();
          micBtn.disabled = false;
          micBtn.click();
        },
        onError: function(code, data) {
          // TODO: Properly integrate this into the state machine
          console.warn('ERR: ' + code + ': ' + (data || ''));
          dictate.cancel();
        },
        onEvent: function(code, data) {
          console.warn('EVENT: ' + code + ': ' + (data || ''));
          console.info(code, data);
        }
      });

      // Init Dictate
      dictate.init();

      // Return dictate
      return dictate;
    }
  };

  document.l10n.ready.then(function() {
    App.init();
  });
}());
