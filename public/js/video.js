/* globals Dom7 */ 
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
        stopStream();
      }
      return startVideo();
    };

    function stopStream() {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }

    function enumerateDevices() {
      return navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
          devices.forEach(function(device) {
            console.log(device);
            if (device.kind === "videoinput") {
              cameras.push(device.deviceId);
            }
          });
          console.log(cameras);
        });
    }

    function startVideo() {
      constraints.video.deviceId = cameras[currCameraIndex];
      return navigator.mediaDevices.getUserMedia(constraints)
        .then(handleSuccess).catch(handleError);
    }

    function handleSuccess(s) {
      videoCanvas.show();
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

      mediaRecorder.onstop = function(event) {
        console.log('Recording stopped, ', event);
      };

      mediaRecorder.ondataavailable = function(event) {
        if (event.data && event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      };

      this.recording = true;
      mediaRecorder.start(10);
    };

    this.stopRecording = function() {
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
      stopStream();
      let superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
      recordedVideoCanvas.show();
      recordedVideoCanvas[0].src = window.URL.createObjectURL(superBuffer);
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
    }

    /*
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
    */


  };
})(window.fj = window.fj || {}, Dom7);
