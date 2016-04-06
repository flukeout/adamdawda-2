var stories = {
  "alex" : {
    "title" : "Sk8r Girl",
    "model" : "Alex the Model",
    "description" : "This and that and this and that, also this and that and this and that and also. That.",
    // "descriptionPosition" : 5,
    "photos" : [
      "alex/alex-small.jpg",
      "alex/photo.jpg",
      "alex/landscape.jpg",
      "alex/alex-small.jpg",
      "alex/landscape.jpg",
      "alex/alex-small.jpg",
      "alex/alex-small.jpg"
    ]
  },
  "balex" : {
    "title" : "YOYO the skater",
    "model" : "blammer",
    "description" : "This and that and this and that, also this and that and this and that and also. That.",
    // "descriptionPosition" : 2,
    "photos" : [
      "alex/landscape.jpg",
      "alex/alex-small.jpg",
      "alex/alex-small.jpg",
      "alex/landscape.jpg"

    ]
  },
  "malex" : {
    "title" : "YOYO the skater",
    "model" : "blammer",
    "description" : "This and that and this and that, also this and that and this and that and also. That.",
    // "descriptionPosition" : 2,
    "photos" : [
      "alex/landscape.jpg",
      "alex/landscape.jpg",
      "alex/landscape.jpg",
      "alex/alex-small.jpg",
      "alex/alex-small.jpg",
      "alex/alex-small.jpg"
    ]
  }
}

var popupOpen = false;

$(document).on("ready",function(){
  loadStories();

  $(window).on("keydown",function(e){
    if(e.keyCode == 37) {
      if(popupOpen){
        changeImage("previous");
      }
    }
    if(e.keyCode == 39) {
      if(popupOpen){
        changeImage("next");
      }
    }

    if(e.keyCode == 27) {
      closePopup();
    }
  });


  setTimeout(function(){
    $(".story").each(function(){
      sizeStory($(this));
    });
  },200);

  $(window).on("scroll",function(e){
    if(popupOpen){
      e.preventDefault();
    }
  });

  $(window).on("resize",function(e){
    $(".story").each(function(){
      sizeStory($(this));
    })
  });



  $("body").on("click",".story img",function(){
    var image = $(this).attr("src");
    var story = $(this).closest(".story").attr("story");
    openViewer(story,image);
    $("body").addClass("no-scroll");
    popupOpen = true;
  });

  $("body").on("click",".popup-viewer .next-photo, .popup-viewer .previous-photo",function(){
    var direction = $(this).attr("direction");
    changeImage(direction);
  });

  $(".popup-viewer").on("click","img",function(){
    changeImage("next");
  });

  $(".popup-viewer").on("click",".close-popup",function(){
    closePopup();
  });

});


function closePopup(){
  $("body").removeClass("no-scroll");
  $(".popup-viewer").addClass("close");
  setTimeout(function(){
    $(".popup-viewer").hide();
  },300)
}

function sizeStory(el){

  var totalWidth = 0;
  var maxWidth = el.width();

  el.find(".photo-wrapper img").css("width","auto");
  el.find(".photo-wrapper img").css("height",200);

  var photos = el.find(".photo-wrapper");
  var photoCount = photos.length;
  var totalWidth = 0;

  el.find(".photo-wrapper").each(function(){
    totalWidth = totalWidth + $(this).width();
    $(this).attr("row","");
  });

  var rowCount = 1;

  if(totalWidth > maxWidth){
    rowCount = Math.ceil(totalWidth / maxWidth);
  }

  var perRow = Math.ceil(photoCount / rowCount);

  var currentRow = 0;

  var added = 0;

  el.find(".photo-wrapper").each(function(index,el){
    $(this).attr("row",currentRow);
    added++;
    if(added >= perRow){
      currentRow++;
      added = 0;
    }
  });

  var rowWidth = el.width() - 100;
  for(var i = 0; i < rowCount; i++) {
    var usedWidth = 0;

    el.find(".photo-wrapper[row="+i+"]").each(function(){
      usedWidth = usedWidth + $(this).width();
    });

    var ratio = usedWidth / rowWidth;

    el.find(".photo-wrapper[row="+i+"] img").each(function(){
      $(this).width($(this).width() * 1/ratio);
      $(this).height("auto");
    });

  }

}

function loadStories(){
  for(var k in stories){
    var story = stories[k];
    var photos = story.photos;

    var storyEl = $("<section class='story'/>");
    storyEl.attr("story",k);

    storyEl.attr("total",photos.length);
    storyEl.attr("loaded",0);

    var totalWidth = 90;


    for(var i = 0; i < photos.length; i++){
      var photo = photos[i];
      var photoEl = $("<div class='photo-wrapper'/>");
      var imageEl = $("<img />");
      imageEl.css("display","none");
      imageEl.attr("src","photos/" + photo);

      imageEl.on("load",function(){
        $(this).show();
        var ratio = $(this).width() / $(this).height();
        var loaded = parseInt($(this).closest(".story").attr("loaded"));
        var total = parseInt($(this).closest(".story").attr("total"));
        loaded++;
        $(this).closest(".story").attr("loaded",loaded);

        if(loaded == total){
          // sizeStory($(this).closest(".story"));
        }

      });

      photoEl.append(imageEl);
      storyEl.append(photoEl);
    }

    // if(story.description) {
    //   var photoEl = $("<div class='photo-wrapper story-description'/>");
    //
    //   var heading = $("<h1>" + story.title + "</h1>");
    //   var description = $("<p>" + story.description + "</p>");
    //   photoEl.append(heading).append(description);
    //   storyEl.find(".photo-wrapper:nth-child("+ parseInt(story.descriptionPosition - 1)   +")").after(photoEl);
    // }

    $(".site-wrapper").append(storyEl);
  }
}

var currentStoryName;
var currentImageIndex;
var currentStory;

function openViewer(storyName,image){
  currentStoryName = storyName;
  currentStory = stories[storyName];
  var imageName = image.replace("photos/","");
  currentImageIndex =  stories[storyName].photos.indexOf(imageName);
  updateDots();
  var viewer = $('.popup-viewer');
  var story = stories[storyName];
  viewer.find("h1").text(story.title);
  viewer.find("p").text(story.description);
  viewer.find(".image img").attr("src",image);
  $(".popup-viewer").css("display","block");
  $(".popup-viewer").removeClass("close");
}

function changeImage(direction){

  if(direction == "next") {
    currentImageIndex++;
    if(currentImageIndex >= currentStory.photos.length) {
      currentImageIndex = 0;
    }
  } else {
    currentImageIndex--;
    if(currentImageIndex < 0) {
      currentImageIndex = currentStory.photos.length - 1;
    }
  }

  var newSrc = currentStory.photos[currentImageIndex];

  var viewer = $('.popup-viewer');
  viewer.find(".image img").attr("src","photos/" + newSrc);
  updateDots();

}

function updateDots(){
  var dotCount = stories[currentStoryName].photos.length;
  $(".progress .dot").remove();
  for(i = 0; i < dotCount; i++) {
    var dot = $("<div class='dot'/>");
    $(".progress").append(dot);
  }
  $(".progress .dot:nth-child("+ (currentImageIndex + 1) +")").addClass("current");
}



