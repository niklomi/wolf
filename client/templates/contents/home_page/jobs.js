Template.jobs.helpers({
  description:function(){
    let tmp_full = this.description;
    tmp_full = tmp_full.replace(/^\s*job\s*description\s*/i,"");
    tmp_full = tmp_full.replace(/^\s*description\s*/i,"").trim();
    return `${tmp_full}..`;
  },
  checklength: function(tmp){
    if (tmp.length > 65) return tmp.substring(0,50) + '..';
    return tmp;
  },
  premium: function(){
    if (this.highlight === "on") return 'mark-h color-font';
  },
  trends: function(){
    var category = this.category;
    return (category.indexOf('trends') >= 0);
  },
  premium_back:function(){
    if (this.highlight === 'on') return 'wolfy-back';
  }
});

Template.tag.events({
  'click a, click .tags-wrap':function(event,template){
    event.stopPropagation();
    let tag = $(event.currentTarget).text().trim().toLowerCase();
    find_add_tag(tag);
  },
})
