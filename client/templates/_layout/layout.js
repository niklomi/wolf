Template.layout.onCreated(function(){
  Session.setDefault('searchTagsOpen', false);
});

Template.layout.onRendered(function(){
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
});
