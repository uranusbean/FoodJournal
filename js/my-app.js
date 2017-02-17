  // Initialize your app
var myApp = new Framework7({
  material: true
});

// Export selectors engine
var $$ = Dom7;
var tagSelected = {};
var formData;
var today =  new Date(),
    year = today.getFullYear();
    month = today.getMonth() + 1;
    day = today.getDate(),
    // time = today.getHours() + ":" + today.getMinutes();
    time = today.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true }); //time format to am/pm
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
      createContentPage();
    });
});

myApp.onPageInit('textfeed', function(page) {
  $$('.chip').on('click', function(e){
    let content = $$(this).find('.chip-label').text();

    if (!tagSelected[content]) {
      let deleteBtn = $$('<a href="#" class="chip-delete"></a>')
        .on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var chip = $$(this).parents('.chip');
          // chip.remove();
          chip.removeClass('tagSelected');
          $$(this).remove();
          tagSelected[content] = false;
        });

      $$(this).addClass('tagSelected')
        .append(deleteBtn);

      tagSelected[content] = true;
    }
  console.log(tagSelected);
  });

  $$('.form-to-data').on('click', function(){
    formData = myApp.formToData('#my-form');
    // console.log(formData);
    // alert(JSON.stringify(formData));
  });
});

myApp.onPageInit('textfeed_plate', function(page) {
  var count = 0;
  $$('.grainPortion').on('click',function(){
    count = (count + 1) % 4;
    if (count == 1) {
      $$('#grainSmallPortion').css('fill-opacity', '1');
    } else if (count == 2){
      $$('#grainMediumPortion').css('fill-opacity', '1');
    } else if (count == 3){
      $$('#grainLargePortion').css('fill-opacity', '1');
    } else if (count == 0){
      $$('#grainSmallPortion').css('fill-opacity', '0');
      $$('#grainMediumPortion').css('fill-opacity', '0');
      $$('#grainLargePortion').css('fill-opacity', '0.1');
    }
  });

  $$('.vegePortion').on('click',function(){
    count = (count + 1) % 4;
    if (count == 1) {
      $$('#vegeSmallPortion').css('fill-opacity', '1');
    } else if (count == 2){
      $$('#vegeMediumPortion').css('fill-opacity', '1');
    } else if (count == 3){
      $$('#vegeLargePortion').css('fill-opacity', '1');
    } else if (count == 0){
      $$('#vegeSmallPortion').css('fill-opacity', '0');
      $$('#vegeMediumPortion').css('fill-opacity', '0');
      $$('#vegeLargePortion').css('fill-opacity', '0.1');
    }
  });

  $$('.fruitsPortion').on('click',function(){
    count = (count + 1) % 4;
    if (count == 1) {
      $$('#fruitsSmallPortion').css('fill-opacity', '1');
    } else if (count == 2){
      $$('#fruitsMediumPortion').css('fill-opacity', '1');
    } else if (count == 3){
      $$('#fruitsLargePortion').css('fill-opacity', '1');
    } else if (count == 0){
      $$('#fruitsSmallPortion').css('fill-opacity', '0');
      $$('#fruitsMediumPortion').css('fill-opacity', '0');
      $$('#fruitsLargePortion').css('fill-opacity', '0.1');
    }
  });

  $$('.proteinPortion').on('click',function(){
    count = (count + 1) % 4;
    if (count == 1) {
      $$('#proteinSmallPortion').css('fill-opacity', '1');
    } else if (count == 2){
      $$('#proteinMediumPortion').css('fill-opacity', '1');
    } else if (count == 3){
      $$('#proteinLargePortion').css('fill-opacity', '1');
    } else if (count == 0){
      $$('#proteinSmallPortion').css('fill-opacity', '0');
      $$('#proteinMediumPortion').css('fill-opacity', '0');
      $$('#proteinLargePortion').css('fill-opacity', '0.1');
    }
  });
});

myApp.onPageInit('addvideo', function(page) {
  prepareRecording();
})

myApp.onPageInit('timeline', function(page) {
  $$('.newestPostDay').html(day);
  $$('.newestPostTime').html(time);
  var generatedFeed = 'I ate at ' + formData.location + ' with ' + formData.withWhom +
      '. The meal is ' + Object.keys(tagSelected);
  $$('#timelineEntry').html(generatedFeed);
})

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}
