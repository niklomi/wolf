inProduction = function() {
  return process.env.NODE_ENV === 'production';
}

addhttp = function(url) {
  if (!url) return null;
  if (!isURL(url)) {
    url = 'http://' + url;
  }
  return url;
}

isURL = function(s) {
  let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

makeUrl = function({position, company, createdAt}){
  let sanitize = function sanitize(tmp){
    return tmp.replace(/(^\-+|[^a-zA-Z0-9\/_| -]+|\-+$)/g, '').toLowerCase().replace(/[\/_| -]+/g, '-').trim();
  }

  let url = `${sanitize(position)}-${sanitize(company)}`;
  if (Posts.findOne({createdAt: {$ne : createdAt}, url: url})) return `${url}-${moment(createdAt).format('YYYY-MM-DD')}`
  return url;
}

Date.prototype.addDays = function( d ) {
  this.setDate( this.getDate() + d );
  return this;
};

sitemap = function() {
  sitemaps.add('/sitemap.xml', function() {
    let out = [],
    pages = Posts.find({status: true}, {fields: {url: 1, createdAt: 1}}).fetch();
    _.each(pages, function(page) {
      out.push({
        page: 'job/' + page.url,
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

reg_r_brackets = / *\([^)]*\) */g;
reg_r_tire = /\s(-[^-]*)\b.*/;
