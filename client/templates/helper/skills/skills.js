Template.skills.onCreated(function(){
	this.select = new ReactiveVar(false);
	this.tags = new ReactiveVar();
	let self = this;
	Meteor.call('tags_to_client',function(err,res){
		if (!err) {
			let array = [];
			_.each(res,function(tag){
				array.push(tag);
			});
			self.tags.set(_.uniq(array));
		}
	});
});

Template.skills.helpers({
	show:function(){
		return Template.instance().select.get();
	},
	tags:function(){
		let template = Template.instance();
		if (template.tags.get() && template.tags.get().length > 0) return template.tags.get();
	},
	tag: function(){
		return this.capitalize();
	}
})

Template.skills.events({
	'click .skills-head':function(e,template){
		template.select.get() === true ? template.select.set(false) : template.select.set(true);
		if (template.tags.get()) return false;
		Meteor.call('tags_to_client',function(err,res){
			if (!err) {
				let array = [];
				_.each(res,function(tag){
					array.push(tag);
				});
				template.tags.set(_.uniq(array));
			}
		});
	},
	'click .chose-tag':function(event,template){
		let tag = $(event.currentTarget).text().trim().toLowerCase();
		find_add_tag(tag);
	}
})
