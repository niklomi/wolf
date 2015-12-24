Template.main_page.onRendered(function(){
	$(window).scroll(function(){
		$('#future-fix').css('max-width',$('#future-fix').width());
		$('#future-fix').css('min-width','234px');
		if ($(window).scrollTop() > $('.header').height() + 70) {
			$('#future-fix').addClass('add-fix');
		} else {
			$('#future-fix').removeClass('add-fix');
		}
	});
});
