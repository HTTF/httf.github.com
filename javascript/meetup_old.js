$(document).ready(function() {
  var events = Object({"results" : []});
  var text='';
  var currDate = new Date();
  var currTime = currDate.getTime();
  var monthAhead = currTime+2592000000;
  var tech_groups = ['MakerBar','NJTechBreakfast'];

  $(tech_groups).each(function(index, group) {
    var URL = 'https://api.meetup.com/2/events.json/?group_urlname='+group+'&sign=true&time='+currTime+','+monthAhead+'&status=upcoming&key=676e1e5f20b623b131e2e4a553b7b41';
    $.ajax({
      type: 'GET',
      url: URL,
      dataType: 'jsonp',
      success: function(data, status) {
        $.merge(events,data.results);
      },
      error: function() {
        alert("Error");
      }
    });
  });
  $.each(events.results, function(index, val) {
    var dteNow = new Date(val.time);
    text += '<p><a href="'+ val.event_url + '">' + val.name + '</a> ' + dteNow.toLocaleString() + '</p>';
  });

  $('#calendar').html(text);
});
