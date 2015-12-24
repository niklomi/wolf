Template.filter.onCreated(function(){
	this.select = new ReactiveVar(false);
	Session.set('find-tags',[]);
});

Template.filter.helpers({
	postsIndex: () => PostsIndex,
	getInputAttributes:function(){
		data = {
			class:"filter-head do-it-like-input",
			placeholder:this.name,
			id:"live-search"
		}
		return data;
	},
	show:function(){
		return Template.instance().select.get();
	},
	tags:function(){
		let template = Template.instance();
		if (Session.get('all_tags') && Session.get('all_tags').length > 0) return Session.get('all_tags');
	}
})

Template.filter.events({
	'click .filter-head-block':function(e,template){
		template.select.get() === true ? template.select.set(false) : template.select.set(true);
	},
	'click .filter-head-input':function(e,template){
		if (Session.get('all_tags')) return false;
		get_tags_array();
	},
	'click .chose-tag':function(event,template){
		let tag = $(event.currentTarget).text().trim().toLowerCase();
		find_add_tag(tag);
	}
})
