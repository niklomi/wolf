Meteor.startup(function(){
	SyncedCron.start();
	clean_new();
	sitemap();

	if ( Meteor.users.find().count() === 0 ) {
		var abc = Accounts.createUser({
			username: Meteor.settings.private.admin.username,
			password: Meteor.settings.private.admin.password
		});
		Roles.addUsersToRoles(abc, ['admin']);
	}
	Accounts.config({
		forbidClientAccountCreation: true
	});

	_.each(Posts.find().fetch(),function(post){
		Posts.update(post._id,{$rename:{"companyUrl":"company_url","fullContent":"description","applyUrl":"apply_url","tag":"tags","maskUrl":"mask_url"}});
	});

	// _.each(Posts.find({source:'wwr'}).fetch(),function(post){
	// 	console.log(post.image);
	// });
	// Posts.remove({source:'stack'});
});

Cheerio = Meteor.npmRequire('cheerio');
Future = Meteor.npmRequire('fibers/future');
xml2js = Meteor.npmRequire('xml2js');
urlapi = Meteor.npmRequire('url');
Twit = Meteor.npmRequire('twit');
request = Meteor.npmRequire('request');
SlackAPI = Meteor.npmRequire( 'node-slack' ),
Slack = new SlackAPI( Meteor.settings.private.slack.hook );
