Template.less_more.onRendered(function(){
	Session.setDefault('show_less_info',false);
})

Template.less_more.events({
    'click .less-more': _.throttle(function(){
        Session.set('show_less_info', ! Session.get('show_less_info'));
    }, 300)
})
