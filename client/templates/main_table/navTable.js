Template.navTable.helpers({
    active: function(pageName){
        return Router.current().route.getName() === pageName ? 'active' : '';
    }
});
Template.navTable.events({
	'click .navigate':function(){
		var instance = EasySearch.getComponentInstance(
	      { index: 'posts' }
	    );
	    Session.set('countofshow',75);
	    instance.clear();
		$('html, body').animate({
		    scrollTop: ($('.table_nav').offset().top)
		},300);
	}
})
