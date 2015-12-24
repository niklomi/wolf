String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

Template.registerHelper("capitalize",function(str){
	return str.capitalize();
});

Template.registerHelper('date_from_now', function(context, options) {
	if(!context) return false;
	var time = moment(context).fromNow();
	time = time.indexOf('minutes') > 0 ? time.replace('minutes','min') : time;
	time = time.indexOf('minute') > 0 ? time.replace('minute','min') : time;
	time = time.indexOf('seconds ago') > 0 ? time.replace('seconds ago','sec') : time;
	time = time.indexOf('months') > 0 ? time.replace('months','mon') : time;
	return time;
});

Template.registerHelper('formatTimeshema', function(context, options) {
	if(context)
		return moment(context).format('YYYY-MM-DD');
});

Template.registerHelper('set_image_name',function(word){
	var matches = word.match(/\b(\w)/g).join('').substring(0,2);
	return matches.toLowerCase();
});

Template.registerHelper('check_img',function(image){
	let array = [];
	_.each(company_images,function(item){
		let background = item.name === image ? item.url : null;
		if (background) array.push(background);
		return;
	});
	if (array.length === 1) return array[0];
	return image;
});

Template.registerHelper('array_category',function(){
	let array = categories_filter;
	return array;
});

Template.registerHelper('active_tag',function(item){
	item = item.trim().toLowerCase();
	if (Session.get('find-tags').length > 0 && Session.get('find-tags').indexOf(item) > -1) return true;
});

Template.registerHelper('active_category',function(item){
	item = item.trim().toLowerCase();
	if (Session.get('find-category').length > 0 && Session.get('find-category').indexOf(item) > -1) return true;
});
