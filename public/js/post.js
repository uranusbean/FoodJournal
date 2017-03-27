/* globals Dom7 */
(function(fj, $) {
  'use strict';

  fj.newPost = function() {
    return {
      _id: new Date(Date.now()),
      location: "",
      withWhom: "",
      time: new Date(Date.now()),
      chips: {},
      hasVideo: false,
      video: null,
      videoMirrored:false
    };
  };

  fj.savePost = function(post, db) {
    console.log(Object.keys(post));
    return db.db.put(post)
      .then(function() {
        if (post.video !== null ) {
          console.log("Saving video");
          return db.db.putAttachment(
              post._id, 'video',
              post.video, 'video/webm');
        }
      }).catch(function(err){
        console.log(err);
      });
  };

  fj.renderPersonalTimeline = function(canvas, posts) {
    if (!posts || posts.length === 0) {
      canvas.html("<div>No journal yet</div> " +
      "<div>Tap the  <i class=" + "material-icons" + ">add_circle_outline</i> icon to get started</div>").addClass('noFeedsMsg');
      return;
    }

    let currDay = -1;
    let currMonth = -1;
    let currYear = -1;
    let timelineDayContainer;
    for (let i = 0; i < Math.min(30, posts.length); i++) {
      let feed = posts[i].doc;
      let time = new Date(feed.time);

      // If day changed, start a new date
      if (time.getDate() !== currDay ||
        time.getMonth() !== currMonth ||
        time.getFullYear() !== currYear) {
        currDay = time.getDate();
        currMonth = time.getMonth();
        currYear = time.getFullYear();

        // TimelineItem is a collection of card that is logged at the same day
        let timelineItemDom = insertTimelineItemDom(canvas, currMonth,
          currDay);
        timelineDayContainer = timelineItemDom.find('.timeline-item-content');
      }

      renderPostCard(timelineDayContainer, feed);
    }
  };

  let insertTimelineItemDom = function(canvas, month, day) {
    let monthNames = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    return canvas.append($(
      '<div class="timeline-item">' +
      '<div class="timeline-item-date">' +
      '<span class="newestPostDay">' + day + '</span>' +
      '<span class="newestPostMonth">' + monthNames[month] + '</span>' +
      '</div>' +
      '<div class="timeline-item-divider"></div>' +
      '<div class="timeline-item-content">' +
      '</div>' +
      '</div>'
    ));
  };

  let renderPostCard = function(canvas, post) {
    let chipDomContainer = $(
      '<div></div>'
    );

    for (var i = 0; i < Object.keys(post.chips).length; i++) {
      let chip = $(
        '<div class="chip">' +
          '<div class="chip-label">' +
            Object.keys(post.chips)[i] +
          '</div>' +
        '</div>'
      );
      chipDomContainer.append(chip);
    }


    let dom = $(
      '<div class = "timeline-item-inner">' +
        '<div class="timeline-item-time newestPostTime">' +
          new Date(post.time).getHours() + ':' +
          new Date(post.time).getMinutes() +
        '</div>' +
        '<div class="timelinePostLocation">' +
          '<i class="material-icons location-timeline-icon">location_on</i>'+
          post.location +
        '</div>' +
        ' with ' + post.withWhom +
      '</div>'
    );

    let videoDom = $(
      '<div>' +
        '<video></video>' +
        '<button class="playBtnInTimeline"><i class="material-icons">play_circle_outline</i></button>' +
        // '<button class="editBtnInTimeline"> <i class="material-icons">mode_edit</i> </button>' +
      '</div>'
    );
    dom.append(chipDomContainer);

    canvas.append(dom);

    let videoPlayer = videoDom.find('video');
    if (post.hasVideo) {
      let superBuffer = new Blob(post.video, {type: 'video/webm'});
      videoPlayer[0].src = window.URL.createObjectURL(superBuffer);
      dom.append(videoDom);
      if (post.videoMirrored) {
        videoPlayer.addClass('mirrored');
      }
    }

    dom.find('button').click(function() {
      videoPlayer[0].play();
    });
  };

})(window.fj = window.fj || {}, Dom7);
