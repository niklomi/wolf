Posts = new Mongo.Collection('posts');

PostsIndex = new EasySearch.Index({
	collection: Posts,
	fields: ['position','company','tags','category'],
	engine: new EasySearch.Minimongo({
		sort: function () {
			return { createdAt: -1 }
		}
	})
});
