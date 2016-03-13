reg_r_brackets = / *\([^)]*\) */g;
reg_r_tire = /\s(-[^-]*)\b.*/;

checkImage = function(image){
  let array = [];
  _.each(companyImages, function(item){
    let background = item.name === image ? item.url : null;
    if (background) array.push(background);
  });
  if (array.length === 1) return array[0];
  return image;
}

find_add_tag = function(tag){
  $('#live-search').val("");
  PostsIndex.getComponentMethods().search("");

  let tags = FlowRouter.getQueryParam('tags');
  if (tags && tags.split(' ').length > 0){
    if (tags.split(' ').indexOf(tag) > -1) {
      let array = tags.split(' ');
      array = _.without(array,tag);
      if (array.length === 0) {
        Session.set('countofshow', 50);
        FlowRouter.setQueryParams({'tags': null});
      } else FlowRouter.setQueryParams({'tags': array.join(' ')});
    }
    else {
      let array = tags.split(' ');
      array.push(tag);
      FlowRouter.setQueryParams({'tags': array.join(' ')});
    }
  }
  else{
    let array = [];
    array.push(tag);
    FlowRouter.setQueryParams({'tags': array.join(' ')});
  }
}

isURL = function (s) {
  if (s === "http://null") return false;
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}
