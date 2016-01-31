_allpostSub = new SubsManager({
	cacheLimit: 100,
	expireIn: 15
});

FlowRouter.route('/', {
	name: "main",
	triggersEnter: [trackRouteEntry],
	action: function() {
		var description = "The bigest job board where you can easily find 100% remote jobs for digital nomads, the fastest way to find great remote work in the best companies and startups",
		title = "Digital and Tech Remote Jobs for designers, developers and digital nomads";

		var metaInfo = [{name: "description", content: description},
			{name: "twitter:url", content: "http://remotewolfy.com/"},
			{name: "og:url", content: "http://remotewolfy.com/"},
			{name: "twitter:description", content:description},
			{name: "og:description", content:description},
			{name: "og:title", content:title},
			{name: "twitter:title", content:title},
			{name: "twitter:image", content:"http://remotewolfy.com/image/picWOLFY.png"},
			{name: "og:type", content:"website"},
			{name: "og:local", content:"en_US"}]

		DocHead.setTitle(title);
		_.each(metaInfo,function(title){
			DocHead.addMeta(title);
		});

		BlazeLayout.render('layout', {header: 'header', body: 'time_table'});
	},
	fastRender: true
});

FlowRouter.route('/job/:_id', {
	name: "job",
	triggersEnter: [trackRouteEntry],
	action: function() {
		BlazeLayout.render('layout', {header: 'header_single', body: 'exist_job'});
	},
	fastRender: true
});

FlowRouter.route('/post-job', {
	name: "newjob",
	triggersEnter: [admincheck,trackRouteEntry],
	action: function() {
		DocHead.setTitle("Post Job");
		BlazeLayout.render('layout', {header: 'header_forall', body: 'new_job'});
	}
});


FlowRouter.route('/post', {
	name: "newjob",
	triggersEnter: [trackRouteEntry],
	action: function() {
		var description = "The bigest job board where you can easily find 100% remote jobs for digital nomads, the fastest way to find great remote jobs in the best companies and startups";
		var metaInfo = {name: "description", content: description};
		DocHead.setTitle("Post Remote Job");
		DocHead.addMeta(metaInfo);
		BlazeLayout.render('layout', {header: 'header_forall', body: 'post_job_full',});
	}
});

FlowRouter.route('/info', {
	name: "newjob",
	triggersEnter: [trackRouteEntry],
	action: function() {
		var description = "The bigest job board where you can easily find 100% remote jobs for digital nomads, the fastest way to find great remote jobs in the best companies and startups";
		var metaInfo = {name: "description", content: description};
		DocHead.setTitle("Remote Wolfy Info");
		DocHead.addMeta(metaInfo);
		BlazeLayout.render('layout', {header: 'header_forall', body: 'info'});
	}
});

FlowRouter.route('/jobs/NLerm4sbtzq6MjyZm', {
	name: "login",
	triggersEnter: [trackRouteEntry],
	action: function() {
		DocHead.setTitle("IN");
		BlazeLayout.render('layout', {header: 'header', body: 'list_jobs', userLogin:'userLogin'});
	}
});

FlowRouter.notFound = {
	action() {
		BlazeLayout.render('layout', {header: 'notFound'});
	}
};

function trackRouteEntry(context) {
	DocHead.removeDocHeadAddedTags();
}

function admincheck(context, redirect, stop) {
	if (!Meteor.user()) redirect('/');
	if (Meteor.user() && !Roles.userIsInRole(Meteor.userId(), ['admin'])) {
		redirect('/');
	}
}
