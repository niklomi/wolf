Meteor.publish('posts', function(count, tags, url) {
  if (!tags) tags = undefined;
  if (url) {
    check(url, String);
    return Posts.find({url: url, status: true}, {fields: { status: 0}});
  }
  check(count, Number);
  check(tags, Match.Optional([String]));
  function transform(doc) {
    doc.description = doc.description.replace(/<\/?[^>]+>/gi, '').substring(0, 180);
    return doc;
  }

  let query = tags ? {status: true, tags: {$all: tags}} : {status: true};
  return Posts.find(query, {sort: { createdAt: -1 }, limit: count, fields: {position: 1, company: 1, tags: 1, createdAt: 1, category: 1, url: 1, image: 1, source: 1}});
});

Meteor.publish('testJobs', function() {
  return Posts.find({test: true});
});

Meteor.publish('API', function() {
  return Posts.find();
});

Posts.permit(['update', 'remove', 'insert']).ifHasRole('admin').apply();
