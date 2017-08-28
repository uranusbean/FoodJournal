/* globals Dom7 */
(function(fj, $) {
  'use strict';

  fj.groupTable = {
    // Environment
    breakfast: {type: 'meal', group:'environment', seq:0},
    lunch: {type: 'meal', group:'environment', seq:1},
    dinner: {type: 'meal', group:'environment', seq:2},
    snack: {type: 'meal', group:'environment', seq:3},

    home: {type: 'location', group:'environment', seq:4},
    restaurant: {type: 'location', group:'environment', seq:5},
    work: {type: 'location', group:'environment', seq:6},
    fastfood: {type: 'location', group:'environment', seq:7},

    alone: {type: 'companion', group:'environment', seq:8},
    friends: {type: 'companion', group:'environment', seq:9},
    family: {type: 'companion', group:'environment', seq:10},
    pet: {type: 'companion', group:'environment', seq:11},

    dimmerLight: {type: 'atmospherics', group:'environment', seq:12},
    brighterLight: {type: 'atmospherics', group:'environment', seq:13},
    slowMusic: {type: 'atmospherics', group:'environment', seq:14},
    fastMusic: {type: 'atmospherics', group:'environment', seq:15},
    hot: {type: 'atmospherics', group:'environment', seq:16},
    cold: {type: 'atmospherics', group:'environment', seq:17},
    lightAroma: {type: 'atmospherics', group:'environment', seq:18},
    strongAroma: {type: 'atmospherics', group:'environment', seq:19},

    leftover: {type: 'eatingEffort', group:'environment', seq:20},
    takeout: {type: 'eatingEffort', group:'environment', seq:21},
    easycooking: {type: 'eatingEffort', group:'environment', seq:22},
    masterchef: {type: 'eatingEffort', group:'environment', seq:23},

    TV: {type: 'distraction', group:'environment', seq:24},
    reading: {type: 'distraction', group:'environment', seq:25},
    computer: {type: 'distraction', group:'environment', seq:26},
    driving: {type: 'distraction', group:'environment', seq:27},

    //Food
    water: {type: 'drink', group:'food', seq:28},
    coffee: {type: 'drink', group:'food', seq:29},
    tea: {type: 'drink', group:'food', seq:30},
    dairy: {type: 'drink', group:'food', seq:31},
    soda: {type: 'drink', group:'food', seq:32},
    juice: {type: 'drink', group:'food', seq:33},
    alcohol: {type: 'drink', group:'food', seq:34},

    darkGreenVeg: {type: 'vegetable', group:'food', seq:35},
    starchyVeg: {type: 'vegetable', group:'food', seq:36},
    redOrgangeVeg: {type: 'vegetable', group:'food', seq:37},
    peasBeans: {type: 'vegetable', group:'food', seq:38},

    egg: {type: 'protein', group:'food', seq:39},
    poultry: {type: 'protein', group:'food', seq:40},
    seafood: {type: 'protein', group:'food', seq:41},
    tofu: {type: 'protein', group:'food', seq:42},
    nutsSeeds: {type: 'protein', group:'food', seq:43},
    meat: {type: 'protein', group:'food', seq:44},
    peasBeans: {type: 'protein', group:'food', seq:45},
    processedMeat: {type: 'protein', group:'food', seq:46},

    wholeGrains: {type: 'grains', group:'food', seq:47},
    refinedGrains: {type: 'grains', group:'food', seq:48},

    freshFruit: {type: 'fruit', group:'food', seq:49},
    cannedFruit: {type: 'fruit', group:'food', seq:50},
    driedFruit: {type: 'fruit', group:'food', seq:51},
    frozenFruit: {type: 'fruit', group:'food', seq:52},

    // Feelings
    satisfied: {type: 'positive', group:'feeling', seq:53},
    happy: {type: 'positive', group:'feeling', seq:54},
    peaceful: {type: 'positive', group:'feeling', seq:55},
    energetic: {type: 'positive', group:'feeling', seq:56},
    enthusiastic: {type: 'positive', group:'feeling', seq:57},
    warm: {type: 'positive', group:'feeling', seq:58},
    good: {type: 'positive', group:'feeling', seq:59},
    joyful: {type: 'positive', group:'feeling', seq:60},

    disgusted: {type: 'negative', group:'feeling', seq:61},
    bored: {type: 'negative', group:'feeling', seq:62},
    worried: {type: 'negative', group:'feeling', seq:63},
    disppointed: {type: 'negative', group:'feeling', seq:64},
    guilty: {type: 'negative', group:'feeling', seq:65},
    angry: {type: 'negative', group:'feeling', seq:66}
  };

  fj.newPost = function() {
    return {
      _id: new Date(Date.now()),
      // location: "",
      // withWhom: "",
      time: new Date(Date.now()),
      // chips: {},
      tags: {},
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

    // Play and pause video
    $('.video').parent().click(function () {
      if($(this).children('.video').get(0).paused){
        $(this).children('.video').get(0).play();
        $(this).children('.playBtnInTimeline').fadeOut();
      }else{
        $(this).children('.video').get(0).pause();
        $(this).children('.playBtnInTimeline').fadeIn();
      }
    });

    // Get post timestamp
    var now = moment();
    var formattedPostTimestamp = now.format('MM-DD HH:mm A');
    // console.log(formatted);
    $('.postTimestamp').append(formattedPostTimestamp);

    fj.showViz(post);
  }


  // Show videos in Journey page
  fj.renderPostVideoInJourney = function(post){
    console.log(post);
    let videoPlayer = $('.videoContainerInJourney').find('video');
    if (post.hasVideo) {
      let superBuffer = new Blob(post.video, {type: 'video/webm'});
      videoPlayer[0].src = window.URL.createObjectURL(superBuffer);
      if (post.videoMirrored) {
        videoPlayer.addClass('mirrored');
      }
    }

    // Play and pause video
    $('.video').parent().click(function () {
      if($(this).children('.video').get(0).paused){
        $(this).children('.video').get(0).play();
        $(this).children('.playBtnInTimeline').fadeOut();
      }else{
        $(this).children('.video').get(0).pause();
        $(this).children('.playBtnInTimeline').fadeIn();
      }
    });
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

})(window.fj = window.fj || {}, $);
