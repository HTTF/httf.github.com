var events = [];

function renderCal() {
  var text = "";

  $.each(events, function(index, val) {
    var dteNow = new Date(val.time);
    text += '<p><a href="'+ val.event_url + '">' + val.name + '</a> ' + dteNow.toLocaleString() + '</p>';
  });

  $('#calendar').html(text);
}

function orderEvents(ev1, ev2) {
  if (ev1.time < ev2.time) {
    return -1;
  } else if (ev1.time == ev2.time) {
    return 0;
  } else {
    return 1;
  }
}

$(document).ready(function() {
  var currDate = new Date();
  var currTime = currDate.getTime();
  var monthAhead = currTime+2592000000;
  var tech_groups = ['MakerBar','NJTechBreakfast','NJTechMixer','njtech'];

  $.each(tech_groups,function(index, group) {
    var URL = 'https://api.meetup.com/2/events.json/?group_urlname='+group+'&sign=true&time='+currTime+','+monthAhead+'&status=upcoming&key=676e1e5f20b623b131e2e4a553b7b41';
    $.ajax({
      type: 'GET',
      url: URL,
      dataType: 'jsonp',
      timeout: 10000,
      success: function(data, status) {
        $.each(data.results,function(index,val){
          events.push(val);
        });

        events.sort(orderEvents);

        renderCal();
      },
      error: function(xhr, status, error) {
        alert("Error: " + status);
      }
    });
  });
});
