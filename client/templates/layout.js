Template.layout.onRendered(function(){
	$(window).resize(function(){
		$('#future-fix').css('width',$('.house-right').css('width'));
	});
	$(window).scroll(function(){
		$('#future-fix').css('width',$('.house-right').css('width'));
		if ($(window).scrollTop() > $('.header').height() + 60) {
			$('#make-fix').addClass('fixed');
		} else {
			$('#make-fix').removeClass('fixed');
		}
	});

	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	});
});
