Template.time_table.onCreated(function(){
  Session.setDefault('countofshow', 50)

  var self = this;
  self.ready = new ReactiveVar(false);
  self.autorun(function() {
    FlowRouter.watchPathChange();
    let tags = FlowRouter.getQueryParam('tags'), title, desc;
    if (tags && tags.split(' ').length > 0) {
      title = tags.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' and ') + ' Remote Jobs',
      desc = `Show all new ${title} for Digital Nomads to work from anywhere`;
      setSEO(title, desc);

      tags = _.clone(tags.split(' ')) || [];
    } else {
      setSEO();
    }

    let handle = self.subscribe('posts', Session.get('countofshow'), tags);
    self.ready.set(handle.ready());
  });
});

Template.time_table.onRendered(function(){
  let instance = Template.instance(),
  self = this;

  self.autorun(function() {
    if (instance.ready.get() && Posts.find().count() > 0){
      $(window).scroll(function(){
        if ($(window).scrollTop() + $(window).height() >  $(document).height() - 250) {
          if(Posts.find().count() % Session.get('countofshow') === 0 && Posts.find().count() > 0)
            Session.set('countofshow', Session.get('countofshow') + 25);
        }
      });
    }
  });
});

Template.time_table.helpers({
  postsIndex: () => PostsIndex,
  ready:() => Template.instance().ready.get(),
  no_tags_found:function(){
    let tags = FlowRouter.getQueryParam('tags');

    if (tags && tags.split(' ').length > 0) {
      tags = _.clone(tags.split(' ')) || [];
      return Posts.find({tags: {$all:tags}}).count() === 0;
    }
  },
  morepostexist: function(){
    if(Posts.find().count() % Session.get('countofshow') === 0 && Posts.find().count() > 0)
    return true;
  },
  posts: function(){
    let posts = Posts.find({},{sort: { createdAt: -1 }});
    return posts;
  },
  tags: function(){
    let tags = FlowRouter.getQueryParam('tags');
    if (tags && tags.split(' ').length > 0) return tags.split(' ');
    return false;
  }
});

Template.time_table.events({
  'click .search-tag':function(event,template){
    let tag = $(event.currentTarget).text().trim().toLowerCase();
    find_add_tag(tag);
  }
});
