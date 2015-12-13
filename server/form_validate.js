var SlackAPI = Meteor.npmRequire( 'node-slack' ),
Slack = new SlackAPI( Meteor.settings.private.slack.hook );


Meteor.methods({
	valid1:function(post){
	if (Roles.userIsInRole(this.userId, ['admin'])){
		if (typeof post.highlight === 'undefined') post.highlight = "";
		check(post, Object);
		check(post, {
		    position: String,
		    fullContent: String,
		    company: String,
		    companyUrl: String,
		    highlight: String
		});
		post.fullContent = UniHTML.purify(post.fullContent);
		if (post.companyUrl === "") delete post.companyUrl;
		var tagg = Meteor.call("makeTAG",post.position,[],post.fullContent);
		var catt = Meteor.call("makeCategory",post.position, post.fullContent);
		job = ({
			sitePic: "pic WOLFY",
            tag:  tagg,
            remote: true,
            status: true,
            source: 'WOLFY',
            category: catt
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
			apply:String
		});
		if (data.title.length > 100 || data.title.length > 200 || data.title.length > 200)
			throw new Meteor.Error( 500, 'There was an error processing your request' );
		var job = {
			test:true
		}
		var newpost = _.extend(data, job );
		Posts.insert(newpost);
		var apply = data.apply;
		if (data.apply.length === 0) apply = "-";
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
					{ title: "Apply", value: apply }
				]
			}]
		});
	}
});
