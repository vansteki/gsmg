$(function(){

var appConfig = {
  emitDelay: 500
};

for (var i = 1; i <= 20; i++) {
  if (i != 15)
    $("#zoom").append("<option value='" + i + "'>" + i);
}

var genMapImgSrc = function(place) {
  var mapConfig = {
    zoom: $("#zoom").prop("value"),
    size: $("#width").prop("value") + "x" + $("#height").prop("value"),
    markers: encodeURIComponent(place),
    center: encodeURIComponent(place)
  };

  var baseUrl = 'http://maps.google.com/maps/api/staticmap?sensor=false';
  var markers = encodeURIComponent(place);
  var imgSrc = baseUrl + '&zoom=' + mapConfig.zoom + '&size=' + mapConfig.size + '&markers=' + mapConfig.markers + '&center=' + 　mapConfig.center;
  console.log(imgSrc);
  return imgSrc;
};

var emitImg = function(placeArr) {
  var zoomBeforeEmit = $("#zoom").prop("value");
  for (var i in placeArr) {
    var place = placeArr[i].replace('#map', '').trim();
    console.log(place, i, placeArr.length);
    if (i === 0) {
      $('body #canvas').prepend('<span id=map-item><img src=' + genMapImgSrc(place) + ' class="img-polaroid" data-id=' + i + ' data-zoom=' + zoomBeforeEmit + '></span> ');
    } else {
      $('body #canvas').append('<span id=map-item><img src=' + genMapImgSrc(place) + '  class="img-polaroid" data-id=' + i + ' data-zoom=' + zoomBeforeEmit + '></span> ');
    }
  }
};

var prepare = function() {
  $('body #canvas').html('');
  var mapReg = /\s*#map\s*\w*[\u4E00-\u9FA5]*s*/g;
  var input = $('#editor').val();
  var placeArr = input.match(mapReg);
  emitImg(placeArr);
};

var timer;
$('#editor, #width, #height').keyup(function(e) {
  clearTimeout(timer);
  timer = setTimeout(prepare, appConfig.emitDelay);
});

$("#zoom").change(function() {
  prepare();
});


//map widget
$('#canvas').delegate('#map-item img', 'mouseenter', function() {
  $('#map-widget-panel-origin').clone().attr('id', 'map-widget-panel').appendTo($(this).parent('#map-item'));
  var imgId = $(this).attr('data-id');

  $('.zoom-in').click(function() {
    var imgNow = $('img[data-id =' + imgId + ' ]');
    var imgZoom = parseInt(imgNow.attr('data-zoom'), 10);
    if (imgZoom < 21) {
      var nextZoom = imgZoom + 1;
      var newImgSrc = imgNow.attr('src').replace(/zoom=\d+/, 'zoom=' + nextZoom);
      imgNow.attr('data-zoom', nextZoom);
      console.log(newImgSrc);
      imgNow.attr('src', newImgSrc);
    }
    if (imgNow.attr('data-zoom') === '444') imgNow.attr('src', 'http://i.imgur.com/HIIPBXN.png');
  });
});

$('#canvas').delegate('#map-item img', 'mouseleave', function() {
  console.log('mouseleave');
  var imgId = $(this).attr('data-id');

  $('.zoom-out').click(function() {
    var imgNow = $('img[data-id =' + imgId + ' ]');
    var imgZoom = parseInt(imgNow.attr('data-zoom'), 10);
    if (imgZoom > 0) {
      var nextZoom = imgZoom - 1;
      var newImgSrc = imgNow.attr('src').replace(/zoom=\d+/, 'zoom=' + nextZoom);
      imgNow.attr('data-zoom', nextZoom);
      console.log(newImgSrc);
      imgNow.attr('src', newImgSrc);
    }
  });
});

$('#canvas').delegate('#map-item', 'mouseleave', function() {
  $(this).children().remove('#map-widget-panel');
});


$('textarea:visible:first').focus();

});