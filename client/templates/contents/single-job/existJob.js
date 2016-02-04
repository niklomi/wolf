Template.exist_job.onCreated(function(){
	var self = this;
	self.current_path = new ReactiveVar(FlowRouter.current().path);
	self.ready = new ReactiveVar(false);
	self.suggest = new ReactiveVar();

	Session.setDefault('post_id',FlowRouter.getParam("_id"));
	self.autorun(function() {
		FlowRouter.watchPathChange();
		self.current_path.set(FlowRouter.current().path);
		Session.set('post_id', FlowRouter.getParam("_id"));

		var handle = self.subscribe('posts', null, null, FlowRouter.getParam("_id"),function(){
			var post = Posts.findOne(FlowRouter.getParam("_id")), title, description, company = post.company.replace(/^\s+|\s+$/g, "");

			title = post.position.capitalize() + ' at ' + company + ' ' + moment(post.createdAt).format('YYYY-MM-DD');
			description = company.capitalize() + ' is looking for remote '  + post.position + ' ' + moment(post.createdAt).format('YYYY-MM-DD');

			var metaInfo = [{name: "description", content: description},
				{name: "twitter:url", content: `http://remotewolfy.com${FlowRouter.current().path}`},
				{name: "og:url", content: `http://remotewolfy.com${FlowRouter.current().path}`},
				{name: "twitter:description", content:description},
				{name: "og:description", content:description},
				{name: "og:title", content:title},
				{name: "twitter:title", content:title},
				{name: "og:type", content:"website"},
				{name: "og:local", content:"en_US"}]

			DocHead.setTitle(title);
			_.each(metaInfo,function(title){
				DocHead.addMeta(title);
			});
		});
		self.ready.set(handle.ready());
	});

	self.autorun(function() {
		FlowRouter.watchPathChange();
		self.suggest.set(false);
	});
});

Template.exist_job.onRendered(function(){
	$("html, body").scrollTop(0);
});


Template.exist_job.helpers({
	ready:() => Template.instance().ready.get(),
	job:function(){
		return Posts.findOne(Session.get('post_id'));
	},
	company_have_url:function(){
		if(this.company_url && isURL(this.company_url)) return true;
	},
	curpath:function(){
		let instance = Template.instance();
		let path = instance.current_path.get();
		return `http://remotewolfy.com${path}`
	},
	position:function(){
		return this.position.capitalize();
	},
	suggest: function(){
		let instance = Template.instance(),
		suggest = instance.suggest.get()
		if (suggest) return suggest;
		Meteor.call('suggest_jobs', this._id, function(err, res){
			if (!err && res) {
				instance.suggest.set(res);
			}
		});
	}
});

Template.exist_job.events({
	'click .tags-wrap':function(event,template){
		FlowRouter.go('/');
		let tag = $(event.currentTarget).text().trim().toLowerCase();

		find_add_tag(tag);
	}
})
