Template.tag.events({
  'click a, click .tags-wrap':function(event,template){
    event.stopPropagation();
    let tag = $(event.currentTarget).text().trim().toLowerCase();
    find_add_tag(tag);
  },
})
