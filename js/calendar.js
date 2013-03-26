/*
Create page
*/
var content = '<div class="container"></div><div class="calendar-navigation"><div class="previous"><a> < </a></div><div class="current"><a> Current </a></div><div class="next"><a> > </a></div><div id="dialog"></div></div>';
$("body").html(content);
$("#dialog").html(generateDialog());

/*
Add functionality to links
*/
$(document).ready(function() {
	var container = $('.container');
	container.html(construct());
	setData();

	$(".previous").on('click', function() {

		$.getScript("js/weeklyCalendar.js", function() {
			container.html(construct(-1));
			setData();
		});
	});
	$(".next").on('click', function() {
		$.getScript("js/weeklyCalendar.js", function() {
			container.html(construct(1));
			setData();
		});
	});
	$(".current").on('click', function() {
		$.getScript("js/weeklyCalendar.js", function() {
			container.html(construct());
			setData();
		});
	});
        
        //Keyboard
        
        $(document).keydown(function(e) {
            if(e.keyCode == 37) {
                $.getScript("js/weeklyCalendar.js", function() {
			container.html(construct(-1));
			setData();
		});
            }
            if(e.keyCode == 39) {
                $.getScript("js/weeklyCalendar.js", function() {
			container.html(construct(1));
			setData();
		});
            }
            if(e.keyCode == 32) {
                $.getScript("js/weeklyCalendar.js", function() {
			container.html(construct());
			setData();
		});
            }
        });
        
});