SyncedCron.add({
  name: 'Sitemap generate',
  schedule(parser) {
    return parser.text('every 12 hours');
  },
  job() {
    sitemap();
  },
});

SyncedCron.add({
  name: 'Twitter 24 report',
  schedule(parser) {
    return parser.text('every 24 hours');
  },
  job() {
    if (inProduction()){
      let postsCount = Posts.find({ createdAt: {$gte: (new Date()).addDays(-1)}}).count();
      if (postsCount > 0){
        let tweet = `Daily report: ${postsCount} new remote jobs today #digitalnomad #remotejobs #remotework`;
        T.post('statuses/update', { status:  tweet }, function(err, data, response) {
          if (err) console.log('Twitter daily report | ' + err + moment().format());
        });
      }
    }
  },
});

SyncedCron.add({
  name: 'Parsing Websites',
  schedule(parser) {
    return parser.text('every 30 seconds');
  },
  job() {
    parseStackO();
    // parseGitHub();
    // parseAuthentic();
    // parseWWR2();
    // parseWWM();
    // parseBehance();
    // parseDribbble();
    // parseWFH();
    __createRssFeed();
  },
});

SyncedCron.add({
  name: 'Clean Collection',
  schedule(parser) {
    return parser.text('every 1 day');
  },
  job() {
    let today = new Date(new Date().getTime() - (20 * 24 * 60 * 60 * 1000));
    Posts.remove({ source: { $ne: 'WOLFY' }, createdAt: {$lte: today}});
    let wolfyDay = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
    Posts.remove({source: 'WOLFY', createdAt: {$lte: wolfyDay}});
  },
});
