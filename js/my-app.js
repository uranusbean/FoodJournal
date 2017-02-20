/* globals Framework7 */
/* globals Dom7 */
(function() {
'use strict';

// Initialize your app
var myApp = new Framework7({
  material: true
});

// Export selectors engine
var $$ = Dom7;

let timelineItem;

// Add view
myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

function newTimelineItem() {
  return {
    location: "",
    withWhom: "",
    time: new Date(Date.now()),
    chips: {}
  };
}

myApp.onPageInit('textfeed', function() {
  timelineItem = newTimelineItem();

  $$('.chip').on('click', function(){
    let content = $$(this).find('.chip-label').text();
    let minorClass = $$(this).parent().attr('class');
    let majorClass = "";

    // Get the major class of the chip
    let majorClassDomClass = $$(this).parent().parent().attr('class');
    let majorClassDomSplittedClasses = majorClassDomClass.split(' ');
    for (let i = 0; i < majorClassDomSplittedClasses.length; i++) {
      if (majorClassDomSplittedClasses[i].startsWith('chip-')) {
        majorClass = majorClassDomSplittedClasses[i];
      }
    }

    if (!timelineItem.chips[content]) {
      let deleteBtn = $$('<a href="#" class="chip-delete"></a>')
        .on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var chip = $$(this).parents('.chip');
          // chip.remove();
          chip.removeClass('tagSelected');
          $$(this).remove();
          delete timelineItem.chips[content];
        });

      $$(this).addClass('tagSelected')
        .append(deleteBtn);

      timelineItem.chips[content] = {
        chip: content,
        majorClass: majorClass,
        minorClass: minorClass
      };
    }
  });

  $$('.form-to-data').on('click', function(){
    let formData = myApp.formToData('#my-form');
    timelineItem.location = formData.location;
    timelineItem.withWhom = formData.withWhom;
  });
});

myApp.onPageInit('textfeed_plate', function() {
  var count = 0;

  $$('.grainPortion').on('click',function(){
    count = (count + 1) % 4;
    if (count === 1) {
      $$('#grainSmallPortion').css('fill-opacity', '1');
    } else if (count === 2){
      $$('#grainMediumPortion').css('fill-opacity', '1');
    } else if (count === 3){
      $$('#grainLargePortion').css('fill-opacity', '1');
    } else if (count === 0){
      $$('#grainSmallPortion').css('fill-opacity', '0');
      $$('#grainMediumPortion').css('fill-opacity', '0');
      $$('#grainLargePortion').css('fill-opacity', '0.1');
    }
  });

  $$('.vegePortion').on('click',function(){
    count = (count + 1) % 4;
    if (count === 1) {
      $$('#vegeSmallPortion').css('fill-opacity', '1');
    } else if (count === 2){
      $$('#vegeMediumPortion').css('fill-opacity', '1');
    } else if (count === 3){
      $$('#vegeLargePortion').css('fill-opacity', '1');
    } else if (count === 0){
      $$('#vegeSmallPortion').css('fill-opacity', '0');
      $$('#vegeMediumPortion').css('fill-opacity', '0');
      $$('#vegeLargePortion').css('fill-opacity', '0.1');
    }
  });

  $$('.fruitsPortion').on('click',function(){
    count = (count + 1) % 4;
    if (count === 1) {
      $$('#fruitsSmallPortion').css('fill-opacity', '1');
    } else if (count === 2){
      $$('#fruitsMediumPortion').css('fill-opacity', '1');
    } else if (count === 3){
      $$('#fruitsLargePortion').css('fill-opacity', '1');
    } else if (count === 0){
      $$('#fruitsSmallPortion').css('fill-opacity', '0');
      $$('#fruitsMediumPortion').css('fill-opacity', '0');
      $$('#fruitsLargePortion').css('fill-opacity', '0.1');
    }
  });

  $$('.proteinPortion').on('click',function(){
    count = (count + 1) % 4;
    if (count === 1) {
      $$('#proteinSmallPortion').css('fill-opacity', '1');
    } else if (count === 2){
      $$('#proteinMediumPortion').css('fill-opacity', '1');
    } else if (count === 3){
      $$('#proteinLargePortion').css('fill-opacity', '1');
    } else if (count === 0){
      $$('#proteinSmallPortion').css('fill-opacity', '0');
      $$('#proteinMediumPortion').css('fill-opacity', '0');
      $$('#proteinLargePortion').css('fill-opacity', '0.1');
    }
  });

  $$('#quarter_pies').on('click',function(){
    // $$('#plateDirection').css('opacity',0);
    $$('#healthyPlateAdvice').css('opacity',1);
  });

  $$('.postBtn').on('click', function() {
    let feeds = JSON.parse(localStorage.getItem('foodJournalFeed'));
    if (!feeds) {
      feeds = [];
    }

    feeds.unshift(timelineItem);
    timelineItem = null;

    localStorage.setItem('foodJournalFeed', JSON.stringify(feeds));
  });
});

myApp.onPageInit('addvideo', function() {
  /* globals prepareRecording */
  prepareRecording();
});

function insertTimelineItemDom(canvas, month, day) {
  let monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  return canvas.append($$(
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
}

function insertFeedCard(canvas, feed) {
  let dom = $$(
    '<div class = "timeline-item-inner">' +
    '<div class="timeline-item-time newestPostTime">' +
        new Date(feed.time).getHours() + ':' + new Date(feed.time).getMinutes() +
    '</div>' +
    'I had my meal at ' + feed.location + ' with ' + feed.withWhom + '</div>'
  );

  canvas.append(dom);
}

myApp.onPageInit('timeline', function() {
  let canvas = $$('.timeline');
  let feeds = JSON.parse(localStorage.getItem('foodJournalFeed'));

  if (!feeds || feeds.length === 0) {
    canvas.html("No feed available.");
    return;
  }

  // Newest first
  feeds.sort(function(a, b) {
    return a.time - b.time;
  });

  let currDay = -1;
  let currMonth = -1;
  let currYear = -1;
  let timelineDayContainer;
  for (let i = 0; i < Math.min(30, feeds.length); i++) {
    let feed = feeds[i];
    let time = new Date(feed.time);

    // If day changed, start a new date
    if (time.getDate() !== currDay ||
        time.getMonth() !== currMonth ||
        time.getFullYear() !== currYear) {
      currDay = time.getDate();
      currMonth = time.getMonth();
      currYear = time.getFullYear();

      // TimelineItem is a collection of card that is logged at the same day
      let timelineItemDom = insertTimelineItemDom(canvas, currMonth, currDay);
      timelineDayContainer = timelineItemDom.find('.timeline-item-content');
    }

    insertFeedCard(timelineDayContainer, feed);
  }

  // $$('.newestPostDay').html(day);
  // $$('.newestPostTime').html(time);
  // var generatedFeed = 'I ate at ' + formData.location + ' with ' + formData.withWhom +
  //     '. The meal is ' + Object.keys(tagSelected);
  // $$('#timelineEntry').html(generatedFeed);
});

})();
