Template.main_page.onRendered(function(){
	$(window).resize(function(){
		$('#future-fix').css('width',$('.house-right').css('width'));
	});
	$(window).scroll(function(){
		$('#future-fix').css('width',$('.house-right').css('width'));
		if ($(window).scrollTop() > $('.header').height() + 70) {
			$('#future-fix').addClass('add-fix');
		} else {
			$('#future-fix').removeClass('add-fix');
		}
	});
});
