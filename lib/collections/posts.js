Posts = new Mongo.Collection('posts');
Posts.initEasySearch('position',{
	sort: function () {
	    return {
	      createdAt: -1 
	    };
    }
});
