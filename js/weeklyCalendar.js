var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var week = Date.today().getWeek();


function construct(number) {
	if(isNaN(number)) { number = 0; number2 = 0; }
	if(number != 0) { number2 += number; }
	week = parseInt(week) + parseInt(number2);
	return setWeek(week);
}

function setWeek(weekNumber) {
	var weekdays = [];
        for(var i = 0; i < 7; i++) {
            weekdays.push(Date.today().setWeek(weekNumber).add(i).days());
        }
  	return setCalendar(weekdays, weekNumber);
}

function setCalendar(weekdays, weekNumber) {
	var html = '';
	html += '<div class="calendar">';
	html += '<div class="calendar-top-navigation clearfix">';
	html += '<h2>Year: '+ weekdays[6].getFullYear(); +'';
	html += ' Week: '+ weekdays[1].getISOWeek(); +'</h2>';
	html += '';
	html += '</div>';
	/*
	Build calendar
	*/
	html += '<table class="calendar-table">';
	html += '<tr class="calendar-table-header">';
        html += '<th></th>';
	for(var j=0; j<7; j++) { //put weekday names
		html += '<th>' + days[j] + '</th>';
	}
	html += '</tr>'; // end of names

	html += '<tr class="calendar-table-header">';
    html += '<th></th>';//empty left side row

	for(var i=0; i < 7; i++) {  //put weekday numbers and month
	html += '<th><div class="calendar-table-header-div"><strong>'+weekdays[i].getDate()+'th '+ months[weekdays[i].getMonth()] +'</strong></div></th>';
	} // enn put weekday numbers & month
	html += '</tr>';    //end of calendar header row

	for(var j = 8; j<=22; j++) {	//Build time to left side
		html += '<tr class="calendar-table-body time" id="'+j+'">';
		html += '<th>'+ j +'</th>';

		for(var i=0; i<7; i++) {
			var date = (parseInt(weekdays[i].getMonth()) + 1) + '/' +weekdays[i].getDate() +'/'+ weekdays[i].getFullYear();
			html += '<th class="'+ date +'"></th>';
		}

		html += '</tr>';
	}	//End of time

	html += '</table>';
	html += '</div>';
	return html;
}

function generateDialog() {
var html = '';
html += '<form class="test">';
html += '<p>Event title</p>';
html += '<p><input type="text" name="title" class="title"></p>';
html += '<p>Where</p>';
html += '<p><input type="text" name="place" class="place"></p>';
html += '<p>Date</p>';
html += '<p><input type="text" name="date" class="date"></p>';
html += '<p>Start time</p>';
html += '<p><select name="starttime" class="time">';
for(var i=8; i<=23; i++) {
	html += '<option value="'+i+'">'+ i + '</option>';
}
html += '</select></p>';
html += '<p>Endtime</p>'
html += '<p><select name="endtime" class="time">';
for(var i=8; i<=23; i++) {
	html += '<option value="'+i+'">'+ i + '</option>';
}
html += '</select></p>';
html += '<hr/>';
html += '<p>Repeat</p>';
html += '<p>Days</p>';
html += '<p><input type="text" name="day" class="day" placeholder="Number"></p>';
html += '<p>Weeks</p>';
html += '<p><input type="text" name="week" class="week" placeholder="Number"></p>';
html += '</form>';
return html;
}

/*
Set data when detect click on calendar cell
*/
function setData() {
	addData();
	$(document).ready(function() {

		//get row 
		var row = $('.calendar-table-body th').not(':first');

		//when row is clicked do something
		row.on('click', function() {

			var datakey = $(this).attr('class'); //get clicked cell
			var time = $(this).parent().attr('id');
			$(".date").val(datakey);
			$(".time").val(time);
			$(".time").last().val((parseInt(time)+0));
			
			$(".date").datepicker({
				showWeek: true,
				firstDay: 1,
				dateFormat: "m/d/yy"
			});

			$("#dialog").dialog({
				width: 400,
				draggable: false,
				resizable: false, 
				position: "center",
				title: "Add event",
				buttons: { 
					"Ok": function() {
						datakey = $('.date').val();
						time = $('.time').first().val();
						var time2 = $(".time").last().val();
						var title = $(".title").val();
						var place = $('.place').val();
						var day = $('.day').val();
						var week = $('.week').val();
						parseAndSetData(datakey, title, place, time, time2, day, week);
						$(".test :input").val(''); //Empty all input fields
						$("#dialog").dialog("destroy");
					},
					"Close": function() {
						$(".test :input").val(''); //Empty all input fields
						$(this).dialog("destroy"); 
					} 
				}, // End of buttons 
			}); //End of dialog
		}); //End row.onclick
	}); //End document ready
} //end of function

function generateCell(data) {
	var html = '';
	html += '<div class="cell" id="cell">' + data + '</div>';
	return html;
}

function addData() {
	$(document).ready(function() {
		var row = $('.calendar-table-body th').not(':first');
		row.each(function() {
			var time = $(this).first().parent().attr('id');
			row = $(this).attr('class')+'/'+time;
			if(localStorage.getItem(row)) {
				$(this).html(generateCell(localStorage.getItem(row))); 
			}
		});
	});
}

function parseAndSetData(datakey, title, place, time, time2, repeatday, repeatweek) {
	var month = datakey.split("/")[0];
	var day = datakey.split("/")[1];
	var year = datakey.split("/")[2];
	var hour = datakey.split("/")[3];
	var data = title + '<br>' + place;
	var hours = parseInt(time2) - parseInt(time);
	if(repeatweek == 0) {
		repeatweek = 0;
	}
	if(repeatday == 0) {
		repeatday = 0;	
	}

	//single event
	if(hours == 0 && repeatday == 0 && repeatweek == 0) {

		datakey = $(".date").val() +'/'+ time;
		localStorage.setItem(datakey, data);
	}

	//Just hour repeat
	if(hours > 0 && repeatday == 0 && repeatweek == 0) {
		//repeat for hours
		for(var i=0; i<=hours; i++) {
			datakey = $(".date").val() +'/'+ (parseInt(time) + parseInt(i));
			localStorage.setItem(datakey, data);
		}
	}

	//Just day repeat
	if(repeatday > 0 && hours == 0 && repeatweek == 0) {
		//repeat for days
		for(var i=0; i < repeatday; i++) {
			date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
			datakey = date.add(i).days();	//add one day to date
			date = new Date(month + '/' + (parseInt(day)) + '/' + year);	// set date back to original so there wont be serie like (0+1=1, 1+2=3, 3+3=6, 6+4=10...)
			datakey =  (parseInt(datakey.getMonth())+1) +'/'+ datakey.getDate()+ '/' + datakey.getFullYear() + '/' + time;
			localStorage.setItem(datakey, data);		
		}
	}

	//Just week repeat
	if(repeatweek > 0 && hours == 0 && repeatday == 0) {
		//repeat for weeks
		for(var i=0; i<repeatweek; i++) {
			date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
			datakey = date.add(i).weeks();	//add one day to date
			date = new Date(month + '/' + (parseInt(day)) + '/' + year);	// set date back to original so there wont be serie like (0+1=1, 1+2=3, 3+3=6, 6+4=10...)
			datakey =  (parseInt(datakey.getMonth())+1) +'/'+ datakey.getDate()+ '/' + datakey.getFullYear() + '/' + time;
			localStorage.setItem(datakey, data);
		}
	}

	//if hours and days repeat
	if(hours > 0 && repeatday > 0 && repeatweek == 0) {
		//repeat for days
		for(var i=0; i < repeatday; i++) {	
			//for loop for hours...
			for(var j = 0; j < hours; j++) {
				date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
				datakey = date.add(i).days();	//add one day to date
				timerepeat = ((parseInt(time) + j));
				datakey = (parseInt(datakey.getMonth())+1) +'/'+ datakey.getDate()+ '/' + datakey.getFullYear() + '/' + timerepeat;
				localStorage.setItem(datakey, data);
			}
			date = new Date(month + '/' + (parseInt(day)) + '/' + year);	// set date back to original so there wont be serie like (0+1=1, 1+2=3, 3+3=6, 6+4=10...)		
		}
	}

	//if hours and weeks repeat
	if(hours > 0 && repeatday == 0 && repeatweek > 0) {
		//repeat for weeks
		for(var i=0; i<repeatweek; i++) {
			for(var j = 0; j < hours; j++) {
				timerepeat = ((parseInt(time) + j));
				date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
				datakey = date.add(i).weeks();	//add one day to date
				datakey =  (parseInt(datakey.getMonth())+1) +'/'+ datakey.getDate()+ '/' + datakey.getFullYear() + '/' + timerepeat;
				localStorage.setItem(datakey, data);
			}
			date = new Date(month + '/' + (parseInt(day)) + '/' + year);	// set date back to original so there wont be serie like (0+1=1, 1+2=3, 3+3=6, 6+4=10...)
		}
	}

	//if days and weeks repeat
	if(hours == 0 && repeatday > 0 && repeatweek > 0) {
		for(var i=0; i<repeatweek; i++) {
			date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
			datakey = date.add(i).weeks();	//add one day to date
			for(var j=0; j < repeatday; j++) {
				date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
				datakey = date.add(j).days().add(i).weeks();	//add one day to date
				datakey =  (parseInt(datakey.getMonth())+1) +'/'+ datakey.getDate()+ '/' + datakey.getFullYear() + '/' + time;
				localStorage.setItem(datakey, data);		
			}
			date = new Date(month + '/' + (parseInt(day)) + '/' + year);	// set date back to original so there wont be serie like (0+1=1, 1+2=3, 3+3=6, 6+4=10...)	
		}
	}

	//if hours, days, weeks
	if(hours > 0 && repeatday > 0 && repeatweek > 0) {
		for(var i=0; i<repeatweek; i++) {
			date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
			datakey = date.add(i).weeks();	//add one day to date
			for(var j=0; j < repeatday; j++) {
				//for loop for hours...
				for(var k = 0; k < hours; k++) {
					date = new Date(month + '/' + (parseInt(day)) + '/' + year); // date = day setted
					datakey = date.add(j).days().add(i).weeks();	//add one day to date
					timerepeat = ((parseInt(time) + k));
					datakey = (parseInt(datakey.getMonth())+1) +'/'+ datakey.getDate()+ '/' + datakey.getFullYear() + '/' + timerepeat;
					localStorage.setItem(datakey, data);
				}		
			}
			date = new Date(month + '/' + (parseInt(day)) + '/' + year);	// set date back to original so there wont be serie like (0+1=1, 1+2=3, 3+3=6, 6+4=10...)	
		}
	}

addData();
}
