BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

let trusted = [
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
BrowserPolicy.content.allowImageOrigin('https://*.behance.net');

BrowserPolicy.content.allowOriginForAll('*.twitter.com');
BrowserPolicy.content.allowInlineScripts('*.twitter.com');

BrowserPolicy.content.allowEval('*.twitter.com');

let rootUrl = __meteor_runtime_config__.ROOT_URL;
BrowserPolicy.content.allowConnectOrigin(rootUrl);
BrowserPolicy.content.allowConnectOrigin(rootUrl.replace('http', 'ws'));

_.each(trusted, function(origin) {
  origin = 'https://' + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});
