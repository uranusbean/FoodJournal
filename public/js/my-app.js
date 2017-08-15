/* globals Framework7 */
/* globals Dom7 */
(function(fj) {
'use strict';

// Initialize your app
var myApp = new Framework7({
  material: true
});

// Export selectors engine
var $$ = Dom7;

let currPost;
let db = new fj.DataBase();

myApp.onPageInit('index', function() {

});

// Add view
myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

let groupTable = {
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
}

myApp.onPageInit('videoinfo', function() {
  if(currPost === undefined) {
    currPost = fj.newPost();
  }

  $$('.tagContainer').on('click',function(){
    $$(this).toggleClass('newTagSelected');
    let content = $$(this).find('.hiddenTag').text();
    // console.log(content);
    currPost.tags.push(content);
    console.log(currPost);
  });

});

myApp.onPageInit('videoinfo2', function() {
  if(currPost === undefined) {
    currPost = fj.newPost();
  }

  $$('.tagContainer').on('click',function(){
    $$(this).toggleClass('newTagSelected');
    let content = $$(this).find('.hiddenTag').text();
    // console.log(content);
    currPost.tags.push(content);
    console.log(currPost);
  });

});

myApp.onPageInit('videoinfo3', function() {
  if(currPost === undefined) {
    currPost = fj.newPost();
  }

  $$('.tagContainer').on('click',function(){
    $$(this).toggleClass('newTagSelected');
    let content = $$(this).find('.hiddenTag').text();
    // console.log(content);
    currPost.tags.push(content);
    console.log(currPost);
  });

});

myApp.onPageInit('textfeed', function() {
  currPost = fj.newPost();

  $("input[data-role=materialtags]").materialtags();

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

    if (!currPost.chips[content]) {
      let deleteBtn = $$('<a href="#" class="chip-delete"></a>')
        .on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var chip = $$(this).parents('.chip');
          // chip.remove();
          chip.removeClass('tagSelected');
          $$(this).remove();
          delete currPost.chips[content];
        });

      $$(this).addClass('tagSelected')
        .append(deleteBtn);

     currPost.chips[content] = {
        chip: content,
        majorClass: majorClass,
        minorClass: minorClass
      };
    }
  });

  $$('.form-to-data').on('click', function(){
    let formData = myApp.formToData('#my-form');
    currPost.location = formData.location;
    currPost.withWhom = formData.withWhom;
  });
});

myApp.onPageInit('addvideo', function() {
  currPost = fj.newPost();
  let video = new fj.Video();
  video.initialize().then(function() {

    $$('button#flip').click(function(){
      video.flipCamera();
    });

    // Recodring
    $$('button#record')[0].disabled = false;
    $$('button#record').click(function() {
      if (video.recording) {
        video.stopRecording();
        $$(this).html("Start Recording");
        $$('.saveBtn').css('opacity',1);
        // $$('button#flip').show();
      } else {
        video.startRecording(true);
        $$(this).html("Stop Recording");
        $$('button#flip').hide();
      }
    });

    $$('a.back').click(function(){
      video.stopStream();
    });

    $$('.saveBtn').click(function() {
      currPost.video = video.getVideo();
      currPost.hasVideo = true;
      currPost.videoMirrored = video.isMirrored();
    });

  });

});

myApp.onPageInit('timeline', function() {
  db.db.allDocs({
    include_docs: true,
    attachments: true,
    binary: true,
    descending: true
  }).then(function(doc) {
      console.log(doc);
      fj.renderPersonalTimeline($$(".timeline"), doc.rows);
    }).catch(function(err) {
      console.log(err);
    });
});

})(window.fj = window.fj || {});
