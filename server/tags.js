activeTags = [];

tagsObject = {
  'swift': 'swift',
  'designer': 'design',
  'design': 'design',
  'business': 'finance',
  'banking': 'finance',
  'finance': 'finance',
  'support': 'support',
  'ruby': 'ruby',
  'rails': 'ror',
  'ror': 'ror',
  'rubyonrails': 'ror',
  'expres.js': 'expresjs',
  'expresjs': 'expresjs',
  'meteor': 'meteorjs',
  'meteorjs': 'meteorjs',
  'meteor.js': 'meteorjs',
  'blaze': 'blaze',
  'php': 'php',
  'cakephp': 'cakephp',
  'symfony': 'symfony',
  'groovy': 'groovy',
  'erlang': 'erlang',
  'haskell': 'haskell',
  'ngnix': 'ngnix',
  'react': 'reactjs',
  'react.js': 'reactjs',
  'heroku': 'heroku',
  'laravel': 'laravel',
  'junior': 'junior',
  'copywriter': 'copywriter',
  'copywriting': 'copywriter',
  'mongodb': 'mongodb',
  'photoshop': 'photoshop',
  'clojure': 'clojure',
  'docker': 'docker',
  'reactjs': 'reactjs',
  'android': 'android',
  'ios': 'ios',
  'qa': 'qa',
  '.net': 'net',
  'asp': 'asp',
  'django': 'django',
  'wordpress': 'wordpress',
  'angular': 'angular',
  'angularjs': 'angular',
  'angular.js': 'angular',
  'java': 'java',
  'scala': 'scala',
  'c++': 'cpp',
  'c#': 'csharp',
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'python': 'python',
  'golang': 'golang',
  'illustrators': 'illustrators',
  'enterprise': 'enterprise',
  'backend': 'backend',
  'ember.js': 'emberjs',
  'emberjs': 'emberjs',
  'ember': 'emberjs',
  'marketing': 'marketing',
  'devops': 'devops',
  'jquery': 'jquery',
  'ui': 'uiux',
  'ux': 'uiux',
  'ui/ux': 'uiux',
  'ux/ui': 'uiux',
  'sql': 'sql',
  'nosql': 'nosql',
  'manager': 'manager',
  'lead': 'lead',
  'fullstack': 'fullstack',
  'javascript': 'js',
  'js': 'js',
  'ecmascript': 'js',
  'esmascript': 'js',
  'html': 'html',
  'html5': 'html',
  'css': 'css',
  'css3': 'css',
  'senior': 'senior',
  'graphic': 'design',
  'bitcoin': 'bitcoin',
  'telescope': 'telescope',
  'linux': 'linux',
  'web': 'web',
  'art': 'design',
  'director': 'director',
  'coordinator': 'coordinator',
  'strategist': 'strategist',
  'analyst': 'analytic',
  'front': 'frontend',
  'frontend': 'frontend',
  'financial': 'finance',
  'assistant': 'assistant',
  'Administrator': 'admin',
  'writer': 'writer',
  'data': 'data',
  'drupal': 'drupal',
  'mean': 'meanjs',
  'meanjs': 'meanjs',
  'mean.js': 'meanjs',
  'derby': 'derby',
  'sails': 'sails',
  'sane': 'sane',
  'mojito': 'mojito',
  'tower': 'tower',
  'sleekjs': 'sleekjs',
};

let trends = [
  'reactjs',
  'golang',
  'meteorjs',
  'director',
  'fullstack',
  'angular',
  'erlang',
  'expresjs',
  'bitcoin',
  'meanjs',
  'derby',
  'sails',
  'sane',
  'mojito',
  'tower',
  'sleekjs',
  'swift',
];

let mobile = [
  'ios',
  'android'
];

let enterprise = [
  'java',
  'python',
  'net',
  'asp',
  'cpp',
  'csharp'
];

let designer = [
  'photoshop',
  'frontend',
  'design',
  'uiux'
];

let webdev = [
  'ruby',
  'ror',
  'meteorjs',
  'django',
  'js',
  'html',
  'css',
  'expresjs',
  'nodejs',
  'net',
  'php',
  'cakephp',
  'meanjs',
  'derby',
  'sails',
  'sane',
  'mojito',
  'tower',
  'sleekjs'
];

let fullstack = [
  'meteorjs',
  'expresjs',
  'fullstack',
  'meanjs',
  'derby',
  'sails',
  'mojito',
  'tower',
  'sleekjs'
];

returnTags = function(desc) {
  let zDescr = desc.split(/(\s+)/);
  zDescr = _.uniq(_.map(zDescr, word => word.toLowerCase()));
  zDescr = _.intersection(zDescr, _.keys(tagsObject));
  zDescr = zDescr.map( zDescr => tagsObject[zDescr]);
  if (zDescr.length > 0) return zDescr;

  let xDescr = desc.replace(/[^\w\s]/gi, ' ');
  xDescr = xDescr.split(/\b/);
  xDescr = _.map(xDescr, word => word.toLowerCase());
  xDescr = _.uniq(xDescr);
  xDescr = (_.intersection(xDescr, _.keys(tagsObject)));
  xDescr = xDescr.map( xDescr => tagsObject[xDescr] );
  return xDescr;
}

__makeTAG = function(position, tagArray, desc) {
  check(position, String);
  check(tagArray, Match.Optional([String]));
  check(desc, String);

  if(tagArray.length === 3) {
    return _.shuffle(_.uniq(tagArray));
  }
  let descrTags = returnTags(position);
  tagArray = _.shuffle(_.uniq(_.union(tagArray, descrTags)));
  if(tagArray.length >= 3) return _.first(tagArray, 3);
  else if (tagArray.length < 3) {
    desc = returnTags(desc);
    tagArray = _.uniq(_.union(tagArray, desc));
    if (tagArray.length === 0) return _.shuffle(['web', 'js', 'uiux']);
    return _.first(tagArray, 3);
  } else{
    return ['web', 'js', 'uiux'];
  }
}

__makeCATEGORY = function(position, desc) {
  check(position, String);
  check(desc, String);

  position = returnTags(position);
  desc = returnTags(desc);
  let retArr = [];
  if (_.intersection(position, trends).length >= 1 || _.intersection(desc, trends).length >= 1) {
    retArr.push('trends');
  }
  if (_.intersection(position, mobile).length >= 1 || _.intersection(desc, mobile).length >= 1) {
    retArr.push('mobile');
  }
  if (_.intersection(position, enterprise).length >= 1 || _.intersection(desc, enterprise).length >= 1) {
    retArr.push('enterprise');
  }
  if (_.intersection(position, webdev).length >= 1 || _.intersection(desc, webdev).length >= 1) {
    retArr.push('webdev');
  }
  if (_.intersection(position, designer).length >= 1 || _.intersection(desc, designer).length >= 1) {
    retArr.push('designer');
  }
  if (_.intersection(position, fullstack).length >= 1 || _.intersection(desc, fullstack).length >= 1) {
    retArr.push('fullstack');
  }
  if (_.flatten(retArr).length === 0) retArr.push('other');
  return retArr;
}

// ---------------TAGS to client ------------------------------
__generateTags = function () {
  let array = [];
  _.each(Posts.find({status: true}, {fields: {tags: 1}}).fetch(), function(post) {
    array.push(post.tags);
  });
  activeTags = _.uniq(_.flatten(array));
}

SyncedCron.add({
  name: 'Generate Tags',
  schedule: function(parser) {
    return parser.text('every 30 minutes');
  },
  job: function() {
    __generateTags();
  }
});

Meteor.methods({
  tagsToClient: function(){
    return activeTags;
  }
});

// ---------------TAGS to client ------------------------------
