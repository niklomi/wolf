Template.list_jobs.onCreated(function() {
	var self = this , image;
	self.autorun(function() {
		self.subscribe('list_of_jobs');
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
