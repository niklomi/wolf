Template.less_more.helpers({
	active: function(){
        return FlowRouter.getQueryParam('compact') == true ? true : false;
    }
})

Template.less_more.events({
    'click .less-more':function(e,t){
        let param = FlowRouter.getQueryParam('compact') == true ? 0 : 1;
		FlowRouter.setQueryParams({compact: param});
    }
})
