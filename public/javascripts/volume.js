

$("a#volume").click(function(evt){
	evt.preventDefault();
	
	let icon = $(this).find("i");

	/* if hasClass VolumeUp turn to VolumeOff */
	let volume = icon.hasClass("fa-volume-up") ? 'OFF': 'ON';

	$.post("/volume", {volume})
	.done( (data)=>{
		if (data.success == true){ 
			icon.toggleClass("fa-volume-up fa-volume-off");
		} else if (data.error) {
			alertError(data.error);
		}
	})
	.fail(showErrorModalJquery);
});



