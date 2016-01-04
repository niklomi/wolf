BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
	'*.google-analytics.com',
	'*.cloudfront.net'
];

BrowserPolicy.content.allowConnectOrigin('*.stackoverflow.com');
BrowserPolicy.content.allowConnectOrigin('*.weworkmeteor.com');
BrowserPolicy.content.allowConnectOrigin('*.weworkremotely.com');
BrowserPolicy.content.allowConnectOrigin('*.weworkmeteor.com');
BrowserPolicy.content.allowConnectOrigin('*.wfh.io');
BrowserPolicy.content.allowConnectOrigin('*.behance.net');
BrowserPolicy.content.allowConnectOrigin('*.github.com');
BrowserPolicy.content.allowConnectOrigin('*.authenticjobs.com');

BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
BrowserPolicy.content.allowOriginForAll('*.googleapis.com');

BrowserPolicy.content.allowImageOrigin('http://i.stack.imgur.com');
BrowserPolicy.content.allowImageOrigin('http://github-jobs.s3.amazonaws.com');
BrowserPolicy.content.allowImageOrigin('https://authenticjobs.com');
BrowserPolicy.content.allowImageOrigin('https://authenticjobs.comundefined');


BrowserPolicy.content.allowOriginForAll('*.facebook.net');
BrowserPolicy.content.allowOriginForAll('*.twitter.com');
BrowserPolicy.content.allowInlineScripts('*.twitter.com');
BrowserPolicy.content.allowInlineScripts('*.facebook.net');
BrowserPolicy.content.allowEval('*.facebook.com');
BrowserPolicy.content.allowEval('*.twitter.com');
BrowserPolicy.content.allowOriginForAll('*.facebook.com');

var rootUrl = __meteor_runtime_config__.ROOT_URL;
BrowserPolicy.content.allowConnectOrigin(rootUrl);
BrowserPolicy.content.allowConnectOrigin(rootUrl.replace('http', 'ws'));

_.each(trusted, function(origin) {
	origin = "https://" + origin;
	BrowserPolicy.content.allowOriginForAll(origin);
});
