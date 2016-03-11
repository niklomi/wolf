setSEO = function(title, description, url = 'http://remotewolfy.com/', image = 'http://remotewolfy.com/image/rwseo.png'){
  if (!title) {
    description = 'The best place to find 100% remote jobs and hire remote workers, the fastest way to find great remote work in the best it companies and startups',
    title = 'Remote IT Jobs: Designers, Developers, Programmers, Marketing, Copywriting and more';
  }
  let metaInfo = [{name: 'description', content: description},
    {name: 'og:url', content: url},
    {name: 'og:description', content:description},
    {name: 'og:title', content:title},
    {name: 'og:type', content:'website'},
    {name: 'og:local', content:'en_US'},
    {name: 'og:image', content: image},
    {name: 'twitter:url', content: url},
    {name: 'twitter:description', content:description},
    {name: 'twitter:title', content:title},
    {name: 'twitter:image', content: image},
    {name: 'twitter:site', content: `@remote_wolfy`},
    {name: 'twitter:creator', content: `@remote_wolfy`},
    {name: 'twitter:image:src', content: image}
    ];

  DocHead.setTitle(title);
  _.each(metaInfo,function(title){
    DocHead.addMeta(title);
  });

  let links = [
    {rel: 'image_src', type: 'image/png', href: image},
    {rel: 'apple-touch-icon', sizes: '57x57', href: `${Meteor.absoluteUrl()}image/icons/icon-57x57.png`},
    {rel: 'apple-touch-icon', sizes: '60x60', href: `${Meteor.absoluteUrl()}image/icons/icon-60x60.png`},
    {rel: 'apple-touch-icon', sizes: '72x72', href: `${Meteor.absoluteUrl()}image/icons/icon-72x72.png`},
    {rel: 'apple-touch-icon', sizes: '76x76', href: `${Meteor.absoluteUrl()}image/icons/icon-76x76.png`},
    {rel: 'apple-touch-icon', sizes: '114x114', href: `${Meteor.absoluteUrl()}image/icons/icon-114x114.png`},
    {rel: 'apple-touch-icon', sizes: '120x120', href: `${Meteor.absoluteUrl()}image/icons/icon-120x120.png`},
    {rel: 'apple-touch-icon', sizes: '144x144', href: `${Meteor.absoluteUrl()}image/icons/icon-144x144.png`},
    {rel: 'apple-touch-icon', sizes: '152x152', href: `${Meteor.absoluteUrl()}image/icons/icon-152x152.png`},
    {rel: 'apple-touch-icon', sizes: '180x180', href: `${Meteor.absoluteUrl()}image/icons/icon-180x180.png`},
    {rel: 'icon', type: 'image/png', sizes: '192x192', href: `${Meteor.absoluteUrl()}image/icons/icon-192x192.png`},
    {rel: 'icon', type: 'image/png', sizes: '32x32', href: `${Meteor.absoluteUrl()}image/icons/icon-32x32.png`},
    {rel: 'icon', type: 'image/png', sizes: '96x96', href: `${Meteor.absoluteUrl()}image/icons/icon-96x96.png`},
    {rel: 'icon', type: 'image/png', sizes: '16x16', href: `${Meteor.absoluteUrl()}image/icons/icon-16x16.png`},
  ];
  _.each(links, function(link){
    DocHead.addLink(link)
  });
};

FlowRouter.route('/', {
  name: 'main',
  triggersEnter: [trackRouteEntry],
  action: function() {
    setSEO();
    BlazeLayout.render('layout', {header: 'header', headerImage: 'headerImageHome', body: 'time_table'});
  },
  fastRender: true
});

FlowRouter.route('/jobsjson', {
  name: 'main',
  triggersEnter: [trackRouteEntry],
  action: function() {
    setSEO();
    BlazeLayout.render('layout', {body: 'api'});
  },
  fastRender: true
});

FlowRouter.route('/job/:_id', {
  name: 'job',
  triggersEnter: [trackRouteEntry],
  action: function() {
    BlazeLayout.render('layout', {header: 'header', body: 'exist_job'});
  },
  fastRender: true
});

FlowRouter.route('/post-job', {
  name: 'newjob',
  triggersEnter: [admincheck,trackRouteEntry],
  action: function() {
    var description = 'Post a remote job and hire remote workers and digital nomads for your tech companies and startups',
    title = 'Post a Remote Job';

    setSEO(title, description);

    BlazeLayout.render('layout', {header: 'header', body: 'new_job'});
  }
});

FlowRouter.route('/alljobs', {
  name: 'admin.alljobs',
  triggersEnter: [admincheck,trackRouteEntry],
  action: function() {
    setSEO();

    BlazeLayout.render('layout', {header: 'header', body: 'time_table'});
  }
});

FlowRouter.route('/post', {
  name: 'newjob',
  triggersEnter: [trackRouteEntry],
  action: function() {
    var description = 'Post a remote job and find a greate digital nomads for your companies and startups',
    title = 'Post a Remote Job';

    setSEO(title, description);

    BlazeLayout.render('layout', {header: 'header', body: 'post_job_full',});
  }
});

FlowRouter.route('/info', {
  name: 'newjob',
  triggersEnter: [trackRouteEntry],
  action: function() {
    var description = 'The bigest job board where you can easily find 100% remote jobs for digital nomads, the fastest way to find great remote jobs in the best companies and startups';
    setSEO('More About Remote Jobs', description);

    BlazeLayout.render('layout', {header: 'header', body: 'info'});
  }
});

FlowRouter.route('/rss/jobs', {
  name: 'resJobs',
  triggersEnter: [trackRouteEntry],
  action: function() {
    var description = 'RSS feed with Remote Jobs for designers, developers and digital nomads. More than 500+ remote work.';
    setSEO('RSS Feed Remote Jobs', description);
  }
});

FlowRouter.route('/jobs/NLerm4sbtzq6MjyZm', {
  name: 'login',
  triggersEnter: [trackRouteEntry],
  action: function() {
    DocHead.setTitle('IN');
    BlazeLayout.render('layout', {header: 'header', body: 'list_jobs', userLogin:'userLogin'});
  }
});

FlowRouter.notFound = {
  action() {
    // FlowRouter.go('/')
    BlazeLayout.render('notFound');
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
