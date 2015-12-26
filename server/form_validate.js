Meteor.methods({
	valid1:function(post){
		if (this.userId && Roles.userIsInRole(this.userId, ['admin'])){
			if (typeof post.highlight === 'undefined') post.highlight = "";
			check(post, Object);
			check(post, {
				position: String,
				description: String,
				company: String,
				company_url: String,
				highlight: String,
				apply_url: String
			});
			post.description = UniHTML.purify(post.description,{ noFormatting: true });

			if (post.company_url === "") delete post.company_url;
			var tags = makeTAG(post.position,[],post.description);
			var category = makeCATEGORY(post.position, post.description);
			job = ({
				image: "WOLFY",
				tags:  tags,
				status: true,
				source: 'WOLFY',
				category: category
			});
			var newpost = _.extend(post, job );

			var postId = Posts.insert(newpost);
			tweeet_create(post.company, post.position, postId, post.tag);
		}
	},
	send_job:function(data){
		check (data,{
			title:String,
			desc:String,
		});
		if (data.title.length > 100 || data.desc.length > 200 )
			throw new Meteor.Error( "Error: ", 'There was an error processing your request' );
		var job = {
			test:true,
			status: false
		}
		var newpost = _.extend(data, job );
		Posts.insert(newpost);
		Slack.send({
			text: "New job!",
			username: "Andy Warhol",
			icon_url: "https://tmc-post-content.s3.amazonaws.com/warhol-icon/warhol-icon.png",
			attachments: [{
				fallback: "New job!",
				color: 'good',
				fields: [
				{ title: "Title", value: data.title },
				{ title: "Description url", value: data.desc },
				]
			}]
		});
	}
});
