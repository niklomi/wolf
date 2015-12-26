Meteor.publish('all_posts', function(count){
	check(count, Number);
	var transform = function(doc) {
		doc.description = doc.description.substring(0,140);
		return doc;
	}

	var self = this;

	var observer = Posts.find({status:true},{sort: { createdAt: -1 },limit:count}).observe({
		added: function (document) {
			self.added('posts', document._id, transform(document));
		},
		changed: function (newDocument, oldDocument) {
			self.changed('posts', document._id, transform(newDocument));
		},
		removed: function (oldDocument) {
			self.removed('posts', oldDocument._id);
		}
	});

	self.onStop(function () {
		observer.stop();
	});

	self.ready();
});

Meteor.publish('single_post', function(id) {
	check(id, String);
	return Posts.find({ _id : id , status:true}, {fields: { status: 0}});
});

Meteor.publish('single_post_apply_url', function(id) {
	check(id, String);
	return Posts.find({ _id : id , status:true}, {fields: { apply_url: 1}});
});

Meteor.publish('list_of_jobs', function() {
	return Posts.find({test:true});
});

Posts.permit(['update', 'remove','insert']).ifHasRole('admin').apply();

Posts.before.insert(function (userId, doc) {
	doc.createdAt = new Date();
});
