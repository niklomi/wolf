Template.skills.onCreated(function(){
  this.tags = new ReactiveVar();
  let self = this;
  Meteor.call('getTags', function(err,res){
    if (!err) {
      let array = [];
      _.each(res, function(tag){
        array.push(tag);
      });
      self.tags.set(_.shuffle(_.uniq(array)));
    }
  });
});

Template.skills.helpers({
  allTags: function(){
    const instance = Template.instance();
    if (instance.tags.get() && instance.tags.get().length > 0) return _.first(instance.tags.get(), this.limit);
  }
});

Template.tags.helpers({
  tag: function(){
    return this.capitalize();
  }
})

Template.tags.events({
  'click .tag': function(event, template){
    let tag = $(event.currentTarget).text().trim().toLowerCase();
    find_add_tag(tag);
  }
})
