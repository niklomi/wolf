Template.time_table.onCreated(function(){
	Session.setDefault('countofshow',100)

	var self = this;
	self.ready = new ReactiveVar(false);
	self.autorun(function() {
		let handle = PostSubs.subscribe('all_posts', Session.get('countofshow'));
		self.ready.set(handle.ready());
	});
});

Template.time_table.onRendered(function(){
	$(window).scroll(function(){
		if ($(window).scrollTop() + $(window).height() >  $(document).height() - 250) {
			if(Posts.find().count() % Session.get('countofshow') === 0 && Posts.find().count() > 0)
				Session.set('countofshow', Session.get('countofshow') + 50);
		}
	});
});

Template.time_table.helpers({
	postsIndex: () => PostsIndex,
	ready:() => Template.instance().ready.get(),
	no_tags_found:function(){
		let tags = Session.get('selector-tags')

		if (tags && tags.length > 0) {
			tags = _.clone(tags) || [];
			return Posts.find({tags: {$all:tags}}).count() === 0;
		}
	},
	search:function(){
		let tags = Session.get('selector-tags')

		if (tags && tags.length > 0) {
			tags = _.clone(tags) || [];
			return Posts.find({tags: {$all:tags}});
		}
	},
	morepostexist: function(){
		if(Posts.find().count() % Session.get('countofshow') === 0 && Posts.find().count() > 0)
		return true;
	},
	posts:function(){
		return Posts.find({},{sort: { createdAt: -1 }});
	}
});
