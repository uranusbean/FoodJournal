/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html
'use strict';

function prepareRecording() {

  /* globals MediaRecorder */

  var mediaSource = new MediaSource();
  mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
  var mediaRecorder;
  var recordedBlobs;
  var sourceBuffer;

  var gumVideo = document.querySelector('video#gum');
  var recordedVideo = document.querySelector('video#recorded');

  var recordButton = document.querySelector('button#record');
  var playButton = document.querySelector('button#play');
  var downloadButton = document.querySelector('button#download');
  recordButton.onclick = toggleRecording;
  playButton.onclick = play;
  downloadButton.onclick = download;

  // window.isSecureContext could be used for Chrome
  var isSecureOrigin = location.protocol === 'https:' ||
  location.hostname === 'localhost';
  if (!isSecureOrigin) {
    alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
      '\n\nChanging protocol to HTTPS');
    location.protocol = 'HTTPS';
  }

  // var constraints = {
  //   audio: true,
  //   video: {
  //     facingMode: { exact: "environment" }
  //   }
  // };

  var front = false;
  document.getElementById('flip-button').onclick = function() { front = !front; };

  var constraints = {
    audio: true,
    video: {
      facingMode: (front? "user" : "environment")
    }
  };

  function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream: ', stream);
    window.stream = stream;
    if (window.URL) {
      gumVideo.src = window.URL.createObjectURL(stream);
    } else {
      gumVideo.src = stream;
    }
  }

  function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  navigator.mediaDevices.getUserMedia(constraints).
      then(handleSuccess).catch(handleError);

  function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
  }

  recordedVideo.addEventListener('error', function(ev) {
    console.error('MediaRecording.recordedMedia.error()');
    alert('Your browser can not play\n\n' + recordedVideo.src
      + '\n\n media clip. event: ' + JSON.stringify(ev));
  }, true);

  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  function handleStop(event) {
    console.log('Recorder stopped: ', event);
  }

  function toggleRecording() {
    if (recordButton.textContent === 'Start Recording') {
      startRecording();
    } else {
      stopRecording();
      recordButton.textContent = 'Start Recording';
      playButton.disabled = false;
      downloadButton.disabled = false;
    }
  }

  function startRecording() {
    recordedBlobs = [];
    var options = {mimeType: 'video/webm;codecs=vp9'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + ' is not Supported');
      options = {mimeType: 'video/webm;codecs=vp8'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: 'video/webm'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported');
          options = {mimeType: ''};
        }
      }
    }
    try {
      mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e);
      alert('Exception while creating MediaRecorder: '
        + e + '. mimeType: ' + options.mimeType);
      return;
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
  }

  function stopRecording() {
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    recordedVideo.controls = true;
  }

  function play() {
    var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
  }

  function download() {
    var blob = new Blob(recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
  //---------------------------CHANGE PROMPT- ----------------------------------
  // var prompts = ["How is your meal? (size, appearance, flavour, texture)?",
  //              "How is your eating environment? (setting, temperature, music, lighting, service)?",
  //              "How are you feeling about your eating?"];
  // var count = 0;
  // function changeText() {
  //     $("#prompt").text(prompts[count]);
  //     count < 3 ? count++ : count = 0;
  // }
  // setInterval(changeText, 5000);

(function() {
    var prompts = $(".prompts");
    var promptIndex = -1;
    function showNextPrompt() {
        ++promptIndex;
        prompts.eq(promptIndex % prompts.length)
            .fadeIn(3000)
            .delay(1000)
            .fadeOut(3000, showNextPrompt);
    }
    showNextPrompt();
})();



  //---------------------------GO FULL SCREEN ----------------------------------
  // var goFS = document.getElementById("goFS");
  // goFS.addEventListener("click", function() {
  //     var videoElement = document.getElementById("gum");
  //     videoElement.webkitRequestFullscreen();
  // }, false);


  //---------------------------COUNT DOWN --- ----------------------------------
  // var promptButton = document.getElementById("prompt");
  // var counter = 3;
  // var newElement = document.createElement("p");
  // newElement.innerHTML = "Point camera to the food";
  // var id;
  //
  // promptButton.parentNode.replaceChild(newElement, promptButton);
  //
  // id = setInterval(function() {
  //     counter--;
  //     if(counter < 0) {
  //         newElement.parentNode.replaceChild(promptButton, newElement);
  //         clearInterval(id);
  //     } else {
  //       newElement.innerHTML = "Point camera to the food";
  //         // newElement.innerHTML = "Point camera to the food" + counter.toString() + " seconds.";
  //     }
  // }, 1000);
  //


}
