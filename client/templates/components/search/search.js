Template.search.helpers({
    postsIndex: () => PostsIndex,
    getInputAttributes:function(){
        data = {
            class:"do-it-like-input form-control",
            placeholder: 'Job Title, Company or Skills',
            id:"live-search"
        }
        return data;
    }
});

Template.search.events({
    'keyup #live-search':function(event){
        let value = event.target.value;
        if (value.trim().length > 0 && Session.get('countofshow') !== 2000){
            Session.set('countofshow', 2000);
        } else if (value.trim().length === 0){
            Session.set('countofshow', 50);
        }
    }
})
