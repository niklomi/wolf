Template.header.events({
    'click #hamburger':function(event){
        let attr = $('.hamburger-menu').attr('id');
        console.log(attr);
        if (typeof attr !== typeof undefined && attr !== false && attr !== 'open') {
            $('.hamburger-menu').attr('id','open');
        } else {
            $('.hamburger-menu').attr('id','');
        }
    }
})
