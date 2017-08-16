/* globals Dom7 */
(function(fj, $) {
  'use strict';

  fj.groupTable = {
    // Environment
    breakfast: {type: 'meal', group:'environment'},
    lunch: {type: 'meal', group:'environment'},
    dinner: {type: 'meal', group:'environment'},
    snack: {type: 'meal', group:'environment'},

    home: {type: 'location', group:'environment'},
    restaurant: {type: 'location', group:'environment'},
    work: {type: 'location', group:'environment'},
    fastfood: {type: 'location', group:'environment'},

    alone: {type: 'companion', group:'environment'},
    friends: {type: 'companion', group:'environment'},
    family: {type: 'companion', group:'environment'},
    pet: {type: 'companion', group:'environment'},

    dimmerLight: {type: 'atmospherics', group:'environment'},
    brighterLight: {type: 'atmospherics', group:'environment'},
    slowMusic: {type: 'atmospherics', group:'environment'},
    fastMusic: {type: 'atmospherics', group:'environment'},
    hot: {type: 'atmospherics', group:'environment'},
    cold: {type: 'atmospherics', group:'environment'},
    lightAroma: {type: 'atmospherics', group:'environment'},
    strongAroma: {type: 'atmospherics', group:'environment'},

    leftover: {type: 'eatingEffort', group:'environment'},
    takeout: {type: 'eatingEffort', group:'environment'},
    easycooking: {type: 'eatingEffort', group:'environment'},
    masterchef: {type: 'eatingEffort', group:'environment'},

    TV: {type: 'distraction', group:'environment'},
    reading: {type: 'distraction', group:'environment'},
    computer: {type: 'distraction', group:'environment'},
    driving: {type: 'distraction', group:'environment'},

    //Food
    water: {type: 'drink', group:'food'},
    coffee: {type: 'drink', group:'food'},
    tea: {type: 'drink', group:'food'},
    dairy: {type: 'drink', group:'food'},
    soda: {type: 'drink', group:'food'},
    juice: {type: 'drink', group:'food'},
    alcohol: {type: 'drink', group:'food'},

    darkGreenVeg: {type: 'vegetable', group:'food'},
    starchyVeg: {type: 'vegetable', group:'food'},
    redOrgangeVeg: {type: 'vegetable', group:'food'},
    peasBeans: {type: 'vegetable', group:'food'},

    egg: {type: 'protein', group:'food'},
    poultry: {type: 'protein', group:'food'},
    seafood: {type: 'protein', group:'food'},
    tofu: {type: 'protein', group:'food'},
    nutsSeeds: {type: 'protein', group:'food'},
    meat: {type: 'protein', group:'food'},
    peasBeans: {type: 'protein', group:'food'},
    processedMeat: {type: 'protein', group:'food'},

    wholeGrains: {type: 'grains', group:'food'},
    refinedGrains: {type: 'grains', group:'food'},

    freshFruit: {type: 'fruit', group:'food'},
    cannedFruit: {type: 'fruit', group:'food'},
    driedFruit: {type: 'fruit', group:'food'},
    frozenFruit: {type: 'fruit', group:'food'},

    // Feelings
    satisfied: {type: 'positive', group:'feeling'},
    happy: {type: 'positive', group:'feeling'},
    peaceful: {type: 'positive', group:'feeling'},
    energetic: {type: 'positive', group:'feeling'},
    enthusiastic: {type: 'positive', group:'feeling'},
    warm: {type: 'positive', group:'feeling'},
    good: {type: 'positive', group:'feeling'},
    joyful: {type: 'positive', group:'feeling'},

    disgusted: {type: 'negative', group:'feeling'},
    bored: {type: 'negative', group:'feeling'},
    worried: {type: 'negative', group:'feeling'},
    disppointed: {type: 'negative', group:'feeling'},
    guilty: {type: 'negative', group:'feeling'},
    angry: {type: 'negative', group:'feeling'}
  };

  fj.newPost = function() {
    return {
      _id: new Date(Date.now()),
      // location: "",
      // withWhom: "",
      time: new Date(Date.now()),
      // chips: {},
      tags: [],
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

  fj.renderPostDetail = function(post){
    console.log(post);
    let videoPlayer = $('.videoContainer').find('video');
    if (post.hasVideo) {
      let superBuffer = new Blob(post.video, {type: 'video/webm'});
      videoPlayer[0].src = window.URL.createObjectURL(superBuffer);
      if (post.videoMirrored) {
        videoPlayer.addClass('mirrored');
      }
    }

    $('.videoContainer').find('button').click(function() {
      videoPlayer[0].play();
    });

    fj.showViz();
  }

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
