inProduction = function() {
  return process.env.NODE_ENV === 'production';
}

Date.prototype.addDays = function( d ) {
  this.setDate( this.getDate() + d );
  return this;
};

isURL = function(s) {
  let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

sitemap = function() {
  sitemaps.add('/sitemap.xml', function() {
    let out = [],
    pages = Posts.find({status: true}).fetch();
    _.each(pages, function(page) {
      out.push({
        page: 'job/' + page._id,
        lastmod: page.createdAt,
        priority: 0.9
      });
    });
    out.push({page: '/',  changefreq: 'daily', priority: 1});
    out.push({page: '/info',  changefreq: 'monthly', priority: 0.8});
    out.push({page: '/post',  changefreq: 'monthly', priority: 0.8});
    return out;
  });
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

addhttp = function(url) {
  if (!isURL(url)) {
    url = 'http://' + url;
  }
  return url;
}

reg_r_brackets = / *\([^)]*\) */g;
reg_r_tire = /\s(-[^-]*)\b.*/;
