Template.list_jobs.onCreated(function() {
	var self = this;
	self.autorun(function() {
		self.subscribe('testJobs');
	});
});

Template.list_jobs.helpers({
	posts:function(){
		return Posts.find();
	}
});
Template.list_jobs.events({
	'click .list-jobs-remove-post':function(){
		if (Roles.userIsInRole(Meteor.userId(), ['admin']))
		Posts.remove(this._id);
	}
});
