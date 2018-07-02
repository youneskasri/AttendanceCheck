$("a#volume").click(function(evt){
	evt.preventDefault();
	
	let icon = $(this).find("i");

	/* if hasClass VolumeUp turn to VolumeOff */
	let volume = icon.hasClass("fa-volume-up") ? 'OFF': 'ON';

	$.post("/volume", {volume}, (data)=>{
		if (data.success == true){ 
			icon.toggleClass("fa-volume-up fa-volume-off");
			alert("set volume = "+data.volume)
		}
	}); 
});



