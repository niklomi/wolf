setSEO = function(title, description, url = 'http://remotewolfy.com/', image = 'http://remotewolfy.com/image/rwseo.png'){
	if (!title) {
		description = "The bigest job board where you can easily find 100% remote jobs for digital nomads, the fastest way to find great remote work in the best companies and startups",
		title = "Remote Jobs for Designers, Developers and Digital Nomads";
	}
	var metaInfo = [{name: "description", content: description},
		{name: "twitter:url", content: url},
		{name: "og:url", content: url},
		{name: "twitter:description", content:description},
		{name: "og:description", content:description},
		{name: "og:title", content:title},
		{name: "twitter:title", content:title},
		{name: "twitter:image", content: image},
		{name: "og:type", content:"website"},
		{name: "og:local", content:"en_US"}]

	DocHead.setTitle(title);
	_.each(metaInfo,function(title){
		DocHead.addMeta(title);
	});
}

FlowRouter.route('/', {
	name: "main",
	triggersEnter: [trackRouteEntry],
	action: function() {
		setSEO();
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
		var description = "Post a remote job and find a greate digital nomads for your companies and startups",
		title = "Post a Remote Job";

		setSEO(title, description);

		BlazeLayout.render('layout', {header: 'header_forall', body: 'new_job'});
	}
});


FlowRouter.route('/post', {
	name: "newjob",
	triggersEnter: [trackRouteEntry],
	action: function() {
		var description = "Post a remote job and find a greate digital nomads for your companies and startups",
		title = "Post a Remote Job";

		setSEO(title, description);

		BlazeLayout.render('layout', {header: 'header_forall', body: 'post_job_full',});
	}
});

FlowRouter.route('/info', {
	name: "newjob",
	triggersEnter: [trackRouteEntry],
	action: function() {
		var description = "The bigest job board where you can easily find 100% remote jobs for digital nomads, the fastest way to find great remote jobs in the best companies and startups";
		setSEO('More About Remote Jobs', description);

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
		FlowRouter.go('/')
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
