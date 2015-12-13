Template.loading.helpers({
	puple: function(){
		return Session.get("phrases");
	}
});


Template.loading.rendered = function ( ) { 
	var phrases = new Array(
		"We're testing your patience",
		"The server is powered by a lemon and two electrodes",
		"Blasting a Blast",
		"Pixelating the pixels",
		"Lassoing unicorns",
		"Loading humorous message ... Please Wait",
		"My other load screen is much faster. You should try that one instead",
		"The version I have of this in testing has much funnier load screens"
	);
	Session.set('phrases',phrases[_.random(0, phrases.length)]);
};
