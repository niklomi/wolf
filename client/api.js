Template.api.onCreated(function(){
  this.subscribe('API');
});

Template.api.helpers({
  json() { return JSON.stringify(Posts.find().fetch()) }
})
