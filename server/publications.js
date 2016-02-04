Meteor.publish('posts', function(count, tags, id){
	if (!tags) tags = undefined;

	if (id){
		check(id, String);
		return Posts.find({ _id : id , status:true}, {fields: { status: 0}});
	} else {
		check(count, Number);
		check(tags, Match.Optional([String]));
		var transform = function(doc) {
			doc.description = doc.description.replace(/<\/?[^>]+>/gi, '').substring(0,180);
			return doc;
		}

		var self = this,
		query = {status : true};
		if (tags) query = {status : true, tags: {$all: tags}};

		var observer = Posts.find(query, {sort: { createdAt: -1 }, limit:count}).observe({
			added: function (document) {
				self.added('posts', document._id, transform(document));
			},
			changed: function (newDocument, document) {
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
	}
});

Meteor.publish('list_of_jobs', function() {
	return Posts.find({test:true});
});

Posts.permit(['update', 'remove','insert']).ifHasRole('admin').apply();

Posts.before.insert(function (userId, doc) {
	doc.createdAt = new Date();
});
