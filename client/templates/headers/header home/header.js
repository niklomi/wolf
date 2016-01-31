Template.header_top.events({
    'click #hamburger':function(event){
        let attr = $('.hamburger-menu').attr('id');
        if (typeof attr !== typeof undefined && attr !== false && attr !== 'open') {
            $('.hamburger-menu').attr('id','open');
        } else {
            $('.hamburger-menu').attr('id','');
        }
    },
    'click a':function(event){
        let attr = $('.hamburger-menu').attr('id');
        $('.hamburger-menu').attr('id','');
    }
})
