var events = [];

function getHourOfDay(datetime){
  hr = datetime.getHours(); 
  if (hr<12) {
    return [hr,"AM"];
  } else if (hr>=12){
    return [hr-12,"PM"];
  }
}
function getMinOfHour(datetime){
  min = datetime.getMinutes();
  if (min<10){
    return '0'+min;
  } else {
    return min;
  }

}
function formatRSVPLim(rsvp_limit){
  if (rsvp_limit==undefined){
    return '';
  } else {
    return ' of ' + rsvp_limit;
  }
} 
function hasFee(fee){
    return (fee>0);
}
function formatAddress(){
  var fullAddr='';
  $.each(arguments,function(index,val){
    if (val!=undefined){
      fullAddr += val + ' ';
    }
  });
  return fullAddr;
}
function strip(html){
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent||tmp.innerText;
}
function renderCal() {
  var dayOfWeek = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat','Sun'];
  var monOfYear = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var text = '<ul id="events_container">';

  $.each(events, function(index, val) {
    var event_date = new Date(val.time);
    var hourOfDay = getHourOfDay(event_date);
    text += '<li class="event_line">';
    text += '<div class="event_title">';
    text += '  <a href="'+ val.event_url + '">' + val.name + '</a>';
    text += '</div>';
    text += '<div class="event_meta">';
    text += '  <ul class="meta_list">';
    text += '    <li class="dateTime">';
    text += '      <span class="date">' + dayOfWeek[event_date.getDay()] + ' ' + monOfYear[event_date.getMonth()] + ' ' + event_date.getDate() + '</span><br>';
    text += '      <span class="time">' + hourOfDay[0] + ':'+ getMinOfHour(event_date) + ' ' + hourOfDay[1] + '</span>';
    text += '    </li>';
    text += '    <li class="RSVP">';
    text += '      <a href="' + val.event_url + '">' + val.yes_rsvp_count + formatRSVPLim(val.rsvp_limit) + ' attending </a>';
    text += '    </li>'
    if (val.fee!=undefined){
      text += '    <li class="fee">';
      text += '      <span>Price:</span><br>';
      text += '      <span>'+val.fee.amount+'</span>';
      text += '    </li>'
    }
    text += '  </ul>';
    text += '</div>';
    text += '<div class="event_content">';
    text += '  <ul class="event_list">';
    if (val.venue!=undefined){
      var addr = formatAddress(val.venue.address_1, val.venue.city, val.venue.state);
      text += '    <li class="group_name">';
      text += '      <a href="' + val.event_url + '">' + val.venue.name +'</a>';
      text += '    </li>';
      text += '    <li class="group_address">';
      text += '      <span>'+ addr +'<a href="http://maps.google.com/maps?q='+addr.replace(/ /g,"+")+'">map</a></span>'; 
      text += '    </li>';
    }
    text += '    <li class="group_desc">';
    text += strip(val.description).substring(0,300)+ '...'; 
    text += '    </li>';     
    text += '    <li class="group_host">';
    text += '      <span>Hosted by: '+val.event_hosts[0].member_name+'</span>';
    text += '    </li>';
    text += '  </ul>';
  });
  text += '</ul>'
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
    var URL = 'https://api.meetup.com/2/events.json/?group_urlname='+group+'&sign=true&fields=event_hosts&time='+currTime+','+monthAhead+'&status=upcoming&key=676e1e5f20b623b131e2e4a553b7b41';
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
