Template.skills.onCreated(function(){
	this.select = new ReactiveVar(false);
	Session.set('find-tags',[]);
});

Template.skills.helpers({
	show:function(){
		return Template.instance().select.get();
	},
	tags:function(){
		let template = Template.instance();
		if (Session.get('all_tags') && Session.get('all_tags').length > 0) return Session.get('all_tags');
	},
	tag: function(){
		return this.capitalize();
	}
})

Template.skills.events({
	'click .skills-head':function(e,template){
		template.select.get() === true ? template.select.set(false) : template.select.set(true);
		if (Session.get('all_tags')) return false;
		get_tags_array();
	},
	'click .chose-tag':function(event,template){
		let tag = $(event.currentTarget).text().trim().toLowerCase();
		find_add_tag(tag);
	}
})
