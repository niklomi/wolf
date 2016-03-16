SyncedCron.add({
  name: 'Sitemap generate',
  schedule(parser) {
    return parser.text('every 12 hours');
  },
  job() {
    sitemap();
  }
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
    return parser.text('every 30 minutes');
  },
  job() {
    parseStackRSS();
    parseGitHub();
    parseAuthentic();
    parseWWR2();
    parseWWM();
    parseBehance();
    parseDribbble();
    parseWFH();
  },
});

SyncedCron.add({
  name: 'Create RSS',
  schedule(parser) {
    return parser.text('every 1 hour');
  },
  job() {
    createRssFeed();
  },
});

SyncedCron.add({
  name: 'Clean Collection',
  schedule(parser) {
    return parser.text('every 24 hours');
  },
  job() {
    const deleteDate = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
    Posts.remove({status: true, createdAt: {$lte: deleteDate}});
  },
});
