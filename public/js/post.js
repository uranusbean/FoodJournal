/* globals Dom7 */
(function(fj, $) {
  'use strict';

  fj.newPost = function() {
    return {
      location: "",
      withWhom: "",
      time: new Date(Date.now()),
      chips: {},
      video: {
        data: null,
        isEncoded: false 
      }
    };
  };

  fj.renderPersonalTimeline = function(canvas, posts) {
    if (!posts || posts.length === 0) {
      canvas.html("No feed available.");
      return;
    }

    // Newest first
    posts.sort(function(a, b) {
      return a.time - b.time;
    });

    let currDay = -1;
    let currMonth = -1;
    let currYear = -1;
    let timelineDayContainer;
    for (let i = 0; i < Math.min(30, posts.length); i++) {
      let feed = posts[i];
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
    let dom = $(
      '<div class = "timeline-item-inner">' +
      '<div class="timeline-item-time newestPostTime">' +
      new Date(post.time).getHours() + ':' + 
      new Date(post.time).getMinutes() +
      '</div>' +
      'I had my meal at ' + post.location + 
      ' with ' + post.withWhom + '</div>'
    );

    canvas.append(dom);
  };

})(window.fj = window.fj || {}, Dom7);
