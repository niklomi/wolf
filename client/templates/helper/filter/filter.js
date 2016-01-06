Template.filter.onCreated(function(){
	this.select = new ReactiveVar(false);
	this.search_tag_click = new ReactiveVar(false);
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
	},
	search_tag_click:function(){
		return Template.instance().search_tag_click.get();
	}
})

Template.filter.events({
	'click .filter-head-block':function(e,template){
		template.select.get() === true ? template.select.set(false) : template.select.set(true);
	},
	'click .filter-head-input':function(e,template){
		template.search_tag_click.set(!template.search_tag_click.get());
		if (Session.get('all_tags')) return false;
		get_tags_array();
	},
	'click .chose-tag':function(event,template){
		let tag = $(event.currentTarget).text().trim().toLowerCase();
		find_add_tag(tag);
	},
	'keyup #live-search':function(event){
		let value = event.target.value;
		if (value.trim().length > 0 && Session.get('countofshow') !== 2000){
			Session.set('countofshow', 2000);
		} else if (value.trim().length === 0){
			Session.set('countofshow', 50);
		}
	}
})
