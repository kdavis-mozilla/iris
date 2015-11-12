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
      var play = document.querySelector('#play');
      var stop = document.querySelector('#stop');
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
        console.info('dictate.isConnected: ' + dictate.isConnected);
        if (dictate.isConnected) {
          dictate.stopListening();
        } else {
          dictate.startListening();
        }
        if (microphone.active) {
          microphone.stop();
        } else {
          microphone.start();
          textbox.innerHTML = '';
        }
      };
    },

    initDictate: function() {
      // Create Transcription to hold spoken text
      var tt = new Transcription();

      // Obtain dom elements
      var play = document.querySelector('#play');
      var stop = document.querySelector('#stop');
      var micBtn = document.querySelector('#micBtn');
      var textbox = document.querySelector('#textbox');

      // Create Dictate for speech-to-text
      var dictate = new Dictate({
        server: 'ws://bark.phon.ioc.ee:82/english/duplex-speech-api/ws/speech',
        serverStatus: 'ws://bark.phon.ioc.ee:82/english/duplex-speech-api/ws/status',
        recorderWorkerPath: 'vendor/dictate.js/lib/recorderWorker.js',
        onReadyForSpeech: function() {
          // TODO: Properly integrate this into the state machine
          dictate.isConnected = true;
          play.style.display = 'none';
          stop.style.display = 'block';
          micBtn.disabled = false;
          console.info('Ready for speech');
        },
        onEndOfSpeech: function() {
          // TODO: Properly integrate this into the state machine
          play.style.display = 'block';
          stop.style.display = 'none';
          micBtn.disabled = true;
          console.info('End of speech');
        },
        onEndOfSession: function() {
          // TODO: Properly integrate this into the state machine
          dictate.isConnected = false;
          play.style.display = 'block';
          stop.style.display = 'none';
          micBtn.disabled = false;
          console.info('End of session');
        },
        onServerStatus: function(json) {
          // TODO: Properly integrate this into the state machine
          if (json.num_workers_available == 0 && !dictate.isConnected) {
            micBtn.disabled = true;
          }  else {
            micBtn.disabled = false;
          }
        },
        onPartialResults: function(hypos) {
          // TODO: Generalize to the case where there are more results
          tt.add(hypos[0].transcript, false);
          console.info('onPartialResults: ' + tt.toString());
          textbox.innerHTML = tt.toString();
        },
        onResults: function(hypos) {
          // TODO: Properly integrate this into the state machine
          // TODO: Generalize to the case where there are more results
          tt.add(hypos[0].transcript, true);
          console.info('onResults: ' + tt.toString());
          textbox.innerHTML = tt.toString();
          tt = new Transcription();
        },
        onError: function(code, data) {
          // TODO: Properly integrate this into the state machine
          dictate.cancel();
          console.warn('ERROR: ' + code + ': ' + (data || ''));
        },
        onEvent: function(code, data) {
          console.info('EVENT: ' + code + ': ' + (data || ''));
        }
      });

      // Init dictate.isConnected
      dictate.isConnected = false;

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
