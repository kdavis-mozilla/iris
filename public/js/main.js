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
      this.initDictate();

      // Initialize WaveSurfer
      this.initWaveSurfer();
    },

    initWaveSurfer: function() {
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
        console.info('dictate.isConnected: ' + App.dictate.isConnected);
        if (App.dictate.isConnected) {
          App.dictate.stopListening();
        } else {
          App.dictate.startListening();
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
      var refresh = document.querySelector('#refresh');
      var micBtn = document.querySelector('#micBtn');
      var textbox = document.querySelector('#textbox');

      // Create Dictate for speech-to-text
      App.dictate = new Dictate({
        server: 'ws://52.27.131.95:8888/client/ws/speech',
        serverStatus: 'ws://52.27.131.95:8888/client/ws/status',
        referenceHandler: 'ws://52.27.131.95:8888/client/dynamic/reference',
        interval: 250,
        onReadyForSpeech: function() {
          App.dictate.isConnected = true;
          play.style.display = 'none';
          stop.style.display = 'block';
          refresh.style.display = 'none';
          micBtn.disabled = false;
          console.info('Ready for speech');
        },
        onEndOfSpeech: function() {
          play.style.display = 'none';
          stop.style.display = 'none';
          refresh.style.display = 'block';
          micBtn.disabled = true;
          console.info('End of speech');
        },
        onEndOfSession: function() {
          App.dictate.isConnected = false;
          play.style.display = 'block';
          stop.style.display = 'none';
          refresh.style.display = 'none';
          micBtn.disabled = false;
          console.info('End of session');
        },
        onServerStatus: function(json) {
          if (json.num_workers_available == 0 && !App.dictate.isConnected) {
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
          // TODO: Generalize to the case where there are more results
          tt.add(hypos[0].transcript, true);
          console.info('onResults: ' + tt.toString());
          textbox.innerHTML = tt.toString();
          tt = new Transcription();
        },
        onError: function(code, data) {
          App.dictate.cancel();
          console.warn('ERROR: ' + code + ': ' + (data || ''));
        },
        onEvent: function(code, data) {
          console.info('EVENT: ' + code + ': ' + (data || ''));
        }
      });

      // Init dictate.isConnected
      App.dictate.isConnected = false;

      // Init Dictate
      App.dictate.init();
    }
  };

  document.l10n.ready.then(function() {
    App.init();
  });
}());
