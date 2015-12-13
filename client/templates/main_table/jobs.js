Template.jobs.onCreated(function(){
	this.showFullContent = new ReactiveVar(false);
});

Template.jobs.onRendered(function(){
	this.autorun(function() {
		Session.set('loading',true);
	});
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	});
});


Template.jobs.helpers({
  checklength: function(tmp){
    if (tmp.length > 65) return tmp.substring(0,57) + '..';
    else return tmp;
  },
  showFullContent: function(){
    return Template.instance().showFullContent.get();
  },
  wolfyContent: function(){
    if (this.sitePic === "pic WOLFY") return true;
    else return false;
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
  },
  someposts: function(){
    if (this.source === 'github') return 'githubPosts';
    if (this.source === 'stack') return 'stackPosts';
    if (this.source === 'dribbble') return 'dribbblePosts';
    if (this.source === 'behance') return 'behancePosts';
    if (this.source === 'auth') return 'authenticPosts';
    if (this.source === 'wwm') return 'wwmPosts';
    if (this.source === 'wfh') return 'wfhPosts';
    if (this.source === 'wwr') return 'wwrPosts';
    if (this.source === 'WOLFY') return 'WOLFY';
  },
  tooltipPosts: function(){
    if (this.source === 'github') return 'GitHub';
    if (this.source === 'stack') return 'StackOverflow';
    if (this.source === 'dribbble') return 'Dribbble';
    if (this.source === 'behance') return 'Behance';
    if (this.source === 'auth') return 'Authentic';
    if (this.source === 'wwm') return 'WWM';
    if (this.source === 'wfh') return 'WFH';
    if (this.source === 'wwr') return 'WWR';
    if (this.source === 'WOLFY') return 'RemoteWolfy';
  }
});


Template.jobs.events({
  'click a':function(event, template){
    $('a').tooltip('hide')
    template.showFullContent.set(true);
  },
  'click .smallInfo':function(event, template){
    if (Template.instance().showFullContent.get()) {
      template.showFullContent.set(false);
    }
    else {
      template.showFullContent.set(true);
    }
  },
  'click .navigate':function(){
    var instance = EasySearch.getComponentInstance(
      { index: 'posts' }
    );
    instance.clear();
    $('html, body').animate({
        scrollTop: ($('.table-start').offset().top)
    },300);

  }
});

Template.tags.events({
  'click .navigate':function(){
    var instance = EasySearch.getComponentInstance(
      { index: 'posts' }
    );
    instance.clear();
    Session.set('countofshow',75);
    $('html, body').animate({
        scrollTop: ($('.table-start').offset().top)
    },300);

  }
})

UI.registerHelper('formatTime', function(context, options) {
  if(context)
    return moment(context).format('MMM D');
});

UI.registerHelper('formatTimeshema', function(context, options) {
  if(context)
    return moment(context).format('YYYY-MM-DD');
});
