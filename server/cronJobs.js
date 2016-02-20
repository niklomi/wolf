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
  name: 'Parsing Websites',
  schedule(parser) {
    return parser.text('every 30 minutes');
  },
  job() {
    parseStackO();
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
