Template.exist_job.onCreated(function(){
  let self = this;
  self.current_path = new ReactiveVar(FlowRouter.current().path);
  self.ready = new ReactiveVar(false);
  self.suggest = new ReactiveVar();

  Session.setDefault('post_id',FlowRouter.getParam("_id"));
  self.autorun(function() {
    FlowRouter.watchPathChange();
    self.current_path.set(FlowRouter.current().path);
    Session.set('post_id', FlowRouter.getParam("_id"));

    let handle = self.subscribe('posts', null, null, FlowRouter.getParam("_id"),function(){
      let post = Posts.findOne(FlowRouter.getParam("_id")), company = post.company.replace(/^\s+|\s+$/g, "");

      let title = post.position.capitalize() + ' at ' + company + ' ' + moment(post.createdAt).format('YYYY-MM-DD'),
      description = company.capitalize() + ' is looking for remote freelance '  + post.position + ' ' + moment(post.createdAt).format('YYYY-MM-DD'),
      image = post.image,
      checkedImage = image !== null ? checkImage(image) : image,
      seoImage = undefined;

      if (image && checkedImage.indexOf(image) >= 0){
        seoImage = Meteor.absoluteUrl().slice(0, -1) + checkedImage;
      }else
        seoImage = Meteor.absoluteUrl() + 'image/twitter-image-262x262.png';

      setSEO(title, description, `http://remotewolfy.com${FlowRouter.current().path}`, seoImage);
    });
    self.ready.set(handle.ready());
  });

  self.autorun(function() {
    FlowRouter.watchPathChange();
    self.suggest.set(false);
  });
});

Template.exist_job.onRendered(function(){
  $("html, body").scrollTop(0);
});


Template.exist_job.helpers({
  ready:() => Template.instance().ready.get(),
  job:function(){
    return Posts.findOne(Session.get('post_id'));
  },
  company_have_url:function(){
    if(this.company_url && isURL(this.company_url)) return true;
  },
  curpath:function(){
    let instance = Template.instance();
    let path = instance.current_path.get();
    return `http://remotewolfy.com${path}`
  },
  position:function(){
    return this.position.capitalize();
  },
  suggest: function(){
    let instance = Template.instance(),
    suggest = instance.suggest.get()
    if (suggest) return suggest;
    Meteor.call('suggestJobs', this._id, function(err, res){
      if (!err && res) {
        instance.suggest.set(res);
      }
    });
  }
});

Template.exist_job.events({
  'click .tags-wrap':function(event,template){
    FlowRouter.go('/');
    let tag = $(event.currentTarget).text().trim().toLowerCase();

    find_add_tag(tag);
  }
})
