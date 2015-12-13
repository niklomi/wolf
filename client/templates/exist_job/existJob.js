Template.existJob.onRendered(function(){
  $(function () {
   $('[data-toggle="tooltip"]').tooltip()
  });
});


Template.existJob.helpers({
  company_have_url:function(){
    if(this.companyUrl) return true;
  },
  applyUrlex: function(){
    if(this.applyUrl) return true;
  },
  curpath:function(){
    return Router.current().path;
  },
  company_twi:function(){
    return '@' + this.company.replace(/\s/g,"").toLowerCase();
  },
  trends: function(){
    var category = this.category;
    return (category.indexOf('trends') >= 0);
  }
});
