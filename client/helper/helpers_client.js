String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

Template.registerHelper("capitalize",function(str){
  return str.capitalize();
});

Template.registerHelper('date_from_now', function(context, options) {
  if(!context) return false;
  return moment(context).fromNow();
});

Template.registerHelper('formatTimeshema', function(context, options) {
  if(context)
    return moment(context).format('YYYY-MM-DD');
});

Template.registerHelper('set_image_name', function(word){
  var matches = word.match(/\b(\w)/g).join('').substring(0,2);
  return matches.toLowerCase();
});

Template.registerHelper('check_img', function(image){
  return checkImage(image);
});

Template.registerHelper('active_tag',function(item){
  item = item.trim().toLowerCase();
  let tags = FlowRouter.getQueryParam('tags');
  if (tags && tags.length > 0 && tags.split(' ').indexOf(item) > -1) return true;
});
