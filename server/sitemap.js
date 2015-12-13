SyncedCron.add({
  name: 'Sitemap generate',
  schedule: function(parser) {
     return parser.text('every 12 hours');
  },
  job: function() {
    sitemaps.add('/sitemap.xml', function() {
      var out = [], pages = Posts.find({status:true}).fetch(), tags = _.uniq(_.flatten(Posts.find({}, {tag:1}).map(function(item){ return item.tag; })));
      _.each(pages, function(page) {
        out.push({
          page: 'job/' + page._id,
          lastmod: page.createdAt,
          priority: 0.9
        }); 
      });
      out.push({page: '/',  changefreq: 'daily',priority: 1});
      out.push({page: '/fullstack',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/web-development',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/design',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/enterprise', changefreq: 'daily',priority: 0.8 });
      out.push({page: '/mobile', changefreq: 'daily',priority: 0.8 });
      out.push({page: '/trends',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/wolfy', changefreq: 'daily',priority: 0.8 });
      out.push({page: '/authentic',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/stackoverflow',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/behance', changefreq: 'daily',priority: 0.8 });
      out.push({page: '/dribbble',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/wwm',  changefreq: 'daily',priority: 0.8 });
      out.push({page: '/wfh', changefreq: 'daily',priority: 0.8 });
      out.push({page: '/wwr', changefreq: 'daily',priority: 0.8 });
      out.push({page: '/github', changefreq: 'daily',priority: 0.8 });
      out.push({page: '/wwr',  changefreq: 'daily',priority: 0.8 });
      _.each(tags, function(page) {
        out.push({
          page: 'tags/' + page,
          lastmod: new Date(),
          changefreq: 'daily'
        });
      });
      return out;
    });
  }
});

