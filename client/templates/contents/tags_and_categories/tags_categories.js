Template.tagsAndCategories.onCreated(function(){
  this.tagsLimit = new ReactiveVar(20);
  this.isMore = new ReactiveVar(true);
});

Template.tagsAndCategories.helpers({
  tagsLimit:() => Template.instance().tagsLimit.get(),
  isMore:() => Template.instance().isMore.get(),
  skillsSearch:function() {
    let tags = FlowRouter.getQueryParam('tags');
    if (tags && tags.split(' ').length > 0) return tags.split(' ');
    return false;
  }
});

Template.tagsAndCategories.events({
  'click .show-more': function(e, t) {
    const limit = t.tagsLimit.get() === 20 ? 1000 : 20;
    const isMore = t.tagsLimit.get() === 20 ? false : true;
    t.tagsLimit.set(limit);
    t.isMore.set(isMore);
  }
});
