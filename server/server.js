var clean_new = function(){
   var six_hour = new Date(new Date().getTime() - (12 * 60 * 60 * 1000));
    Posts.find({new_job:true}).forEach(function(doc){
      if (doc.createdAt.getTime() < six_hour.getTime()){
        Posts.update({_id:doc._id},{$set:{new_job:false}});
      }
    });
}

Meteor.startup(function(){
  SyncedCron.start();
  clean_new();
  if ( Meteor.users.find().count() === 0 ) {
    var abc = Accounts.createUser({
          username: Meteor.settings.private.admin.username,
          password: Meteor.settings.private.admin.password
        });
    Roles.addUsersToRoles(abc, ['admin']);
  }
  Accounts.config({
    forbidClientAccountCreation: true
  });

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
});





String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

SyncedCron.add({
  name: 'Pare sites',
  schedule: function(parser) {
     return parser.text('every 30 minutes');
  },
  job: function() {
    Meteor.call("parseWWR2",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("WWR error: " + error.message);
    });
    Meteor.call("parseWFH",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("parseWFH error: " + error.message);
    });
    Meteor.call("parseWWM",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("WWM error: " + error.message);
    });
    Meteor.call("parseDribbble",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("Dribbble error: " + error.message);
    });
    Meteor.call("parseBehance",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("Behance error: " + error.message);
    });
    Meteor.call("parseGitHub",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("GIT error: " + error.message);
    });
    Meteor.call("parseStackO",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("Stack error: " + error.message);
    });
    Meteor.call("parseAuthentic",Meteor.settings.private.admin.key,function(error){
      if(error) console.log("Auth error: " + error.message);
    });
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

SyncedCron.add({
  name: 'Clean new',
  schedule: function(parser) {
     return parser.text('every 5 minutes');
  },
  job: function() {
    clean_new();
  }
});

Meteor.methods({
  ser_time: function(){
      this.unblock();
      var today = moment().toDate();
      var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
      var weekstart = new Date(yesterday - (7 * 24 * 60 * 60 * 1000));
      var monthstart = new Date(weekstart - (30 * 24 * 60 * 60 * 1000));
      data = {
        t: today,
        y: yesterday,
        w: weekstart,
        m: monthstart
      }
      return data;
  }
})

