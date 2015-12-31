reg_r_brackets = / *\([^)]*\) */g;
reg_r_tire = /\s(-[^-]*)\b.*/;

get_tags_array = function(){
	Meteor.call('tags_to_client',function(err,res){
		if (!err) {
			let array = []
			_.each(res,function(tag){
				array.push(tag);
			});
			Session.set('all_tags',_.uniq(array));
		}
	});
}

find_add_tag = function(tag){
	$('#live-search').val("");
	PostsIndex.getComponentMethods().search("");
	if (Session.get('find-tags').length > 0){
		if (Session.get('find-tags').indexOf(tag) > -1) {
			let array = Session.get('find-tags');
			array = _.without(array,tag);
			if (array.length === 0) {
				Session.set('countofshow', 150);
			}
			Session.set('find-tags',array);
		}
		else {
			let array = Session.get('find-tags');
			array.push(tag);
			Session.set('find-tags',array);
		}
	}
	else{
		let array = Session.get('find-tags');
		array.push(tag);
		Session.set('find-tags',array);
	}
}

isURL = function (s) {
	if (s === "http://null") {
		return false;
	}
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}
