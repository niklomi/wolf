SyncedCron.add({
	name: 'Sitemap generate',
	schedule: function(parser) {
		return parser.text('every 12 hours');
	},
	job: function() {
		sitemap();
	}
});


SyncedCron.add({
	name: 'Pare sites',
	schedule: function(parser) {
		return parser.text('every 30 minutes');
	},
	job: function() {
		parseWWR2();
		parseWFH();
		parseWWM();
		parseDribbble();
		parseBehance();
		parseGitHub();
		parseStackO();
		parseAuthentic();
	}
});

SyncedCron.add({
	name: 'Clean Collection',
	schedule: function(parser) {
		return parser.text('every 1 day');
	},
	job: function() {
		var today = new Date(new Date().getTime() - (15 * 24 * 60 * 60 * 1000));
		Posts.remove({source: { $ne: 'WOLFY' } , createdAt:{$lte : today}});
		var wolfy_day = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
		Posts.remove({source: 'WOLFY'  , createdAt:{$lte : wolfy_day}});
	}
});
