Meteor.publish('posts', function(count, tags, id) {
  if (!tags) tags = undefined;

  if (id) {
    check(id, String);
    return Posts.find({ _id: id, status: true}, {fields: { status: 0}});
  }

  check(count, Number);
  check(tags, Match.Optional([String]));
  function transform(doc) {
    doc.description = doc.description.replace(/<\/?[^>]+>/gi, '').substring(0, 180);
    return doc;
  }

  let self = this,
  query = {status: true};
  if (tags) query = {status: true, tags: {$all: tags}};

  let observer = Posts.find(query, {sort: { createdAt: -1 }, limit: count}).observe({
    added: function(document) {
      self.added('posts', document._id, transform(document));
    },
    changed: function(newDocument, document) {
      self.changed('posts', document._id, transform(newDocument));
    },
    removed: function(oldDocument) {
      self.removed('posts', oldDocument._id);
    }
  });

  self.onStop(function() {
    observer.stop();
  });

  self.ready();
});

Meteor.publish('testJobs', function() {
  return Posts.find({test: true});
});

Meteor.publish('API', function() {
  return Posts.find();
});

Posts.permit(['update', 'remove', 'insert']).ifHasRole('admin').apply();
