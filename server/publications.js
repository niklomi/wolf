Meteor.publish('allPosts', function(count){
	if (!count) count = 75;
	check(count, Number);
    return Posts.find({remote:true, status:true},{fields: { status: 0, remote: 0, fullContent: 0}, sort: { createdAt: -1 }, limit : count});
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  if (id) return Posts.find({ _id : id , remote:true, status:true},{fields: { status: 0, remote: 0}});
  return this.ready();
});

Meteor.publish('fPost', function(id) {
  check(id, String);
  if (id) return Posts.find({ _id : id , remote:true, status:false},{fields: { status: 0, remote: 0}});
  return this.ready();
});

Meteor.publish('list_of_jobs', function() {
	return Posts.find({test:true},{sort: { createdAt: -1 }});
});

Meteor.publish('navigation', function(category, count) {
	if (count === 1) count = Posts.find().fetch().length;
	check(count, Number);
	return Posts.find({remote:true, status:true,category: { $in: [category]}},{fields: { status: 0, remote: 0, fullContent: 0}, sort: { createdAt: -1 }, limit : count});
});

Meteor.publish('tags', function(tag, count) {
	if (count === 1) count = Posts.find().fetch().length;
	check(count, Number);
	return Posts.find({remote:true, status:true,tag: tag},{fields: { status: 0, remote: 0, fullContent: 0}, sort: { createdAt: -1 }, limit : count});
});

Meteor.publish('source', function(source, count) {
	if (count === 1) count = Posts.find().fetch().length;
	check(count, Number);
	return Posts.find({remote:true, status:true,source: source},{fields: { status: 0, remote: 0, fullContent: 0}, sort: { createdAt: -1 }, limit : count});
});


Meteor.publish(null, function (){
  return Meteor.roles.find({});
});

Posts.permit(['update', 'remove','insert']).ifHasRole('admin').apply();
