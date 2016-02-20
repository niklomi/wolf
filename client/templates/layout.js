Template.layout.onCreated(function(){
  Session.setDefault('searchTagsOpen', false);
});

Template.layout.onRendered(function(){
  $(window).resize(function(){
    $('#future-fix').css('width',$('.house-right').css('width'));
  });
  $(window).scroll(function(){
    $('#future-fix').css('width',$('.house-right').css('width'));
    if ($(window).scrollTop() > $('.header').height() + 60) {
      $('#make-fix').addClass('fixed');
    } else {
      $('#make-fix').removeClass('fixed');
    }
  });
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  this.autorun(function(){
    console.log(Session.get('searchTagsOpen'));
    if (Session.get('searchTagsOpen')){
        $('.createdBy').addClass('fixed');
        $('.createdBy').css('width', '25rem');
    } else {
      $('.createdBy').removeClass('fixed');
      $('.createdBy').css('width', '100%');
    }
  })
});
