/* globals $ */
/* globals MediaRecorder */
(function(fj, $){
  'use strict';

  fj.Video = function() {
    let cameras = [];
    let currCameraIndex = 0;
    let stream;
    let mediaRecorder;
    let recordedBlobs;
    let constraints = {
      audio: true,
      video: {
        deviceId: ""
      }
    };
    let videoCanvas = $('video#gum');
    let recordedVideoCanvas = $('video#recorded');
    let mirrored = false;

    this.recording = false;

    this.initialize = function() {
      return enumerateDevices()
        .then(startVideo);
    };

    this.flipCamera = function() {
      currCameraIndex += 1;
      if (currCameraIndex >= cameras.length) {
        currCameraIndex = 0;
      }

      if (stream) {
        this.stopStream();
      }
      return startVideo();
    };

    this.stopStream = function() {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
    };

    function enumerateDevices() {
      return navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
          devices.forEach(function(device) {
            if (device.kind === "videoinput") {
              cameras.push(device);
              console.log(device);
            }
          });
        });
    }

    function startVideo() {
      constraints.video.deviceId = cameras[currCameraIndex].deviceId;
      return navigator.mediaDevices.getUserMedia(constraints)
        .then(handleSuccess).catch(handleError);
    }

    function handleSuccess(s) {
      videoCanvas.show();
      if (cameras[currCameraIndex].label.includes("back")) {
        videoCanvas.removeClass('mirrored');
        mirrored = false;
      } else {
        videoCanvas.addClass('mirrored');
        mirrored = true;
      }
      recordedVideoCanvas.hide();
      videoCanvas[0].srcObject = s;
      stream = s;
    }

    function handleError(error) {
      alert(error);
    }

    this.startRecording = function() {
      recordedBlobs = [];
      let options = {mimeType: 'video/webm;codecs=vp9'};
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        alert(e);
      }

      mediaRecorder.ondataavailable = function(event) {
        if (event.data && event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      };

      this.recording = true;
      startPrompt();
      mediaRecorder.start(10);
    };

    this.stopRecording = function() {
      stopPrompt();
      mediaRecorder.stop();
      this.recording = false;
      this.play();
    };

    this.upload =function() {
      let encoder = new FileReader();
      encoder.onloadend = function() {
        $.ajax({
          url: '/api/video',
          method: 'POST',
          data: {
            video: encoder.result
          },
          success: function(data) {
            console.log(data);
          }
        });
      };
      encoder.readAsDataURL(new Blob(recordedBlobs));
    };

    this.play = function() {
      this.stopStream();

      let superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
      recordedVideoCanvas.show();
      recordedVideoCanvas[0].autoplay = false;
      recordedVideoCanvas[0].src = window.URL.createObjectURL(superBuffer);
      recordedVideoCanvas[0].play();
      if (mirrored) {
        recordedVideoCanvas.addClass('mirrored');
      } else {
        recordedVideoCanvas.removeClass('mirrored');
      }
      videoCanvas.hide();
      $('button#record').hide();
      $('button#flip').hide();
      $('button#restart').show().click(function() {
        startOver();
      });
    };

    function startOver() {
      $('button#record').show();
      $('button#flip').show();
      $('button#restart').hide();
      startVideo();
      $('#point-to-meal').show();
    }

    let promptsRunning = false;
    function startPrompt() {
      $('#point-to-meal').hide();
      $("#prompts-container").show();
      promptsRunning = true;
      let prompts = $(".prompts");
      let promptIndex = -1;
      function showNextPrompt() {
        ++promptIndex;
        if (promptsRunning) {
          prompts.eq(promptIndex % prompts.length)
            .fadeIn(1000)
            .delay(10000)
            .fadeOut(1000, showNextPrompt);
        }
      }
      showNextPrompt();
    }

    function stopPrompt() {
      promptsRunning = false;
      $("#prompts-container").hide();
      $(".prompts").clearQueue().hide();
    }

    this.getVideo = function() {
      return recordedBlobs;
    };
  };
})(window.fj = window.fj || {}, $);
