$("a#volume").click(function(evt){
	evt.preventDefault();

	let icon = $(this).find("i");

	let volume = icon.hasClass("fa-volume-up") ? false: true;
	/* $.post("/volume", {volume}, (data)=>{
		if (data.success == true){
			icon.toggleClass("fa-volume-up fa-volume-off");
			alert("set volume = "+data.volume)
		}
	}); */
});



