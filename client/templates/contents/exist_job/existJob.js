Template.exist_job.onRendered(function(){
	var self = this;
	self.current_path = new ReactiveVar(FlowRouter.current().path);
	$("html, body").scrollTop(0);
	self.autorun(function() {
		FlowRouter.watchPathChange();
		self.current_path.set(FlowRouter.current().path);
		var handle = self.subscribe('single_post', FlowRouter.getParam("_id"),function(){
			var post = Posts.findOne(), title, description, company = post.company.replace(/^\s+|\s+$/g, "");

			title = post.position + ' at ' + company + ' ' + moment(post.createdAt).format('YYYY-MM-DD');
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
	});

});

Template.exist_job_apply_url.onRendered(function(){
	var self = this;
	self.current_path = new ReactiveVar(FlowRouter.current().path);

	self.autorun(function() {
		FlowRouter.watchPathChange();
		self.current_path.set(FlowRouter.current().path);
		self.subscribe('single_post', FlowRouter.getParam("_id"));
	});
});

Template.exist_job.helpers({
	job:function(){
		return Posts.findOne();
	},
	company_have_url:function(){
		if(this.company_url) return true;
	},
	curpath:function(){
		let instance = Template.instance();
		let path = instance.current_path.get();
		return `http://remotewolfy.com${path}`
	},
	company_twi:function(){
		// return '@' + this.company.replace(/\s/g,"").toLowerCase();
	}
});

Template.exist_job.events({
	'click .tagsJobs':function(event,template){
		FlowRouter.go('/');
		let tag = $(event.currentTarget).text().trim().toLowerCase();

		find_add_tag(tag);
	}
})

Template.exist_job_apply_url.helpers({
	job:function(){
		return Posts.findOne();
	}
});
