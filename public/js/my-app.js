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

$$('.favoriteBorderIcon').show().on('click',function(){
  // $$('.favoriteIcon').css('opacity',1);
  $$('.favoriteIcon').show();
  // $$('.favoriteBorderIcon').css('opacity', 0);
  $$('.favoriteBorderIcon').hide();
});

$$('.favoriteIcon').hide().on('click',function(){

  $$('.favoriteIcon').hide();
  $$('.favoriteBorderIcon').show();
});

myApp.onPageInit('index', function() {
  $$('.favoriteBorderIcon').show().on('click',function(){
    // $$('.favoriteIcon').css('opacity',1);
    $$('.favoriteIcon').show();
    // $$('.favoriteBorderIcon').css('opacity', 0);
    $$('.favoriteBorderIcon').hide();
  });

  $$('.favoriteIcon').hide().on('click',function(){

    $$('.favoriteIcon').hide();
    $$('.favoriteBorderIcon').show();
  });
});

// Add view
myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.onPageInit('textfeed', function() {
  currPost = fj.newPost();
  // placepicker
  // $(".placepicker").placepicker();
  // $(function(){

  $("#geocomplete").geocomplete()
    .bind("geocode:result", function(event, result){
      $.log("Result: " + result.formatted_address);
    })
    .bind("geocode:error", function(event, status){
      $.log("ERROR: " + status);
    })
    .bind("geocode:multiple", function(event, results){
      $.log("Multiple: " + results.length + " results found");
    });
  //
  // $("#find").click(function(){
  //   $("#geocomplete").trigger("geocode");
  // });


  $("#examples a").click(function(){
    $("#geocomplete").val($(this).text()).trigger("geocode");
    return false;
  });

  // });

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
    fj.savePost(currPost, db);
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

myApp.onPageInit('videoinfo', function() {
  var count = 0;

  $$('.form-to-data').on('click', function(){
    let formData = myApp.formToData('#my-form');
    currPost.location = formData.location;
    currPost.withWhom = formData.withWhom;
  });
  
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
    fj.savePost(currPost, db);
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
