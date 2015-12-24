Template.brodyga.helpers({
	tags:function(){
		let tags = Session.get('find-tags');
		Session.set('selector-tags',tags);
		if (tags && tags.length > 0) {
			return tags;
		}
	}
});

Template.brodyga.events({
	'click .search-tag':function(event,template){
		let tag = $(event.currentTarget).text().trim().toLowerCase();
		find_add_tag(tag);
	}
});

