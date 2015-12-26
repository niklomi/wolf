inProduction = function () {
	return process.env.NODE_ENV === "production";
};

sitemap = function(){
	sitemaps.add('/sitemap.xml', function() {
		var out = [], pages = Posts.find({status:true}).fetch();
		_.each(pages, function(page) {
			out.push({
				page: 'job/' + page._id,
				lastmod: page.createdAt,
				priority: 0.9
			});
		});
		out.push({page: '/',  changefreq: 'daily',priority: 1});
		out.push({page: '/info',  changefreq: 'monthly',priority: 0.8});
		out.push({page: '/post',  changefreq: 'monthly',priority: 0.8});
		return out;
	});
}

clean_new = function(){
	var six_hour = new Date(new Date().getTime() - (12 * 60 * 60 * 1000));
	Posts.find({new_job:true}).forEach(function(doc){
		if (doc.createdAt.getTime() < six_hour.getTime()){
			Posts.update({_id:doc._id},{$set:{new_job:false}});
		}
	});
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

addhttp = function (url) {
	if (!/^(f|ht)tps?:\/\//i.test(url)) {
		url = "http://" + url;
	}
	return url;
}

reg_r_brackets = / *\([^)]*\) */g;
reg_r_tire = /\s(-[^-]*)\b.*/;
