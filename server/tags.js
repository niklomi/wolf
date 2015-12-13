var tagsObject = {
  "swift":"swift",
  "designer":"design",
  "design":"design",
  "business":"finance",
  "banking":"finance",
  "finance":"finance",
  "support":"support",
  "ruby":"ruby",
  "rails":"ror",
  "ror":"ror",
  "rubyonrails":"ror",
  "expres.js":"expresjs",
  "expresjs":"expresjs",
  "meteor":"meteorjs",
  "meteorjs":"meteorjs",
  "meteor.js":"meteorjs",
  "blaze":"blaze",
  "php":"php",
  "cakephp":"cakephp",
  "symfony":"symfony",
  "groovy":"groovy",
  "erlang":"erlang",
  "haskell":"haskell",
  "ngnix":"ngnix",
  "react":"reactjs",
  "react.js":"reactjs",
  "heroku":"heroku",
  "laravel":"laravel",
  "junior":"junior",
  "copywriter":"copywriter",
  "copywriting":"copywriter",
  "mongodb":"mongodb",
  "photoshop":"photoshop",
  "clojure":"clojure",
  "docker":"docker",
  "reactjs":"reactjs",
  "android":"android",
  "ios":"ios",
  "qa":"qa",
  ".net":"net",
  "asp":"asp",
  "django":"django",
  "wordpress":"wordpress",
  "angular":"angular",
  "angularjs":"angular",
  "angular.js":"angular",
  "java":"java",
  "scala":"scala",
  "c++":"cpp",
  "c#":"csharp",
  "node.js":"nodejs",
  "nodejs":"nodejs",
  "python":"python",
  "golang":"golang",
  "illustrators":"illustrators",
  "laravel":"laravel",
  "enterprise":"enterprise",
  "backend":"backend",
  "ember.js":"emberjs",
  "emberjs":"emberjs",
  "ember":"emberjs",
  "marketing":"marketing",
  "devops":"devops",
  "jquery":"jquery",
  "ui":"ui",
  "ux":"ux",
  "ui/ux":"uiux",
  "ux/ui":"uiux",
  "sql":"sql",
  "nosql":"nosql",
  "manager":"manager",
  "lead":"lead",
  "fullstack":"fullstack",
  "javascript":"js",
  "js":"js",
  "ecmascript":"js",
  "esmascript":"js",
  "html":"html",
  "html5":"html",
  "css":"css",
  "css3":"css",
  "senior":"senior",
  "graphic":"design",
  "bitcoin":"bitcoin",
  "telescope":"telescope",
  "linux":"linux",
  "web":"web",
  "art":"design",
  "director":"director",
  "coordinator":"coordinator",
  "strategist":"strategist",
  "analyst":"analytic",
  "front":"frontend",
  "frontend":"frontend",
  "financial":"finance",
  "assistant":"assistant",
  "Administrator":"admin",
  "writer":"writer",
  "data":"data",
  "drupal":"drupal",
  "mean":"meanjs",
  "meanjs":"meanjs",
  "mean.js":"meanjs",
  "derby":"derby",
  "sails":"sails",
  "sane":"sane",
  "mojito":"mojito",
  "tower":"tower",
  "sleekjs":"sleekjs"
}

var trends = new Array(
  "reactjs",
  "golang",
  "meteorjs",
  "director",
  "fullstack",
  "angular",
  "erlang",
  "expresjs",
  "bitcoin",
  "meanjs",
  "derby",
  "sails",
  "sane",
  "mojito",
  "tower",
  "sleekjs",
  "swift"
);

var mobile = new Array(
  "ios",
  "android"
);

var enterprise = new Array(
  "java",
  "python",
  "net",
  "asp",
  "cpp",
  "csharp"
);

var designer = new Array(
  "photoshop",
  "frontend",
  "design",
  "ui",
  "ux",
  "uiux"
);

var webdev = new Array(
  "ruby",
  "ror",
  "meteorjs",
  "django",
  "js",
  "html",
  "css",
  "expresjs",
  "nodejs",
  "net",
  "php",
  "cakephp",
  "meanjs",
  "derby",
  "sails",
  "sane",
  "mojito",
  "tower",
  "sleekjs"
);

var fullstack = new Array(
  "meteorjs",
  "expresjs",
  "fullstack",
  "meanjs",
  "derby",
  "sails",
  "mojito",
  "tower",
  "sleekjs"
);

Meteor.methods({
    makeTAG: function(position, tags_mas, desc){
        check(position, String);
        check(tags_mas, Match.Optional([String]));
        check (desc, String);
        if(tags_mas.length === 3) {
          tags_mas = _.uniq(tags_mas);
          tags_mas = _.shuffle(tags_mas);
          return tags_mas;
        }
        var words = retmas(position);
        tags_mas = _.union(tags_mas,words);
        tags_mas = _.uniq(tags_mas);
        tags_mas = _.shuffle(tags_mas);
        if(tags_mas.length >= 3) {
          tags_mas = _.first(tags_mas, 3);
          return tags_mas;
        } else if (tags_mas.length < 3) {
          desc = retmas(desc);
          tags_mas = _.union(tags_mas,desc);
          tags_mas = _.uniq(tags_mas);
          tags_mas = _.first(tags_mas, 3);
          if (tags_mas.length === 0) return _.shuffle(["web","js","ui"]);
          else return tags_mas;
        }
  },
  makeCategory: function(posi, desc){
      check(posi, String);
      check (desc, String);
      posi = retmas(posi);
      desc = retmas(desc);
      var retArr = [];
      if (_.intersection(posi,trends).length >= 1 || _.intersection(desc,trends).length >= 1) {
        retArr.push('trends');
      }
      if (_.intersection(posi,mobile).length >= 1 || _.intersection(desc,mobile).length >= 1) {
       retArr.push('mobile');
      }
      if (_.intersection(posi,enterprise).length >= 1 || _.intersection(desc,enterprise).length >= 1) {
       retArr.push('enterprise');
      }
      if (_.intersection(posi,webdev).length >= 1 || _.intersection(desc,webdev).length >= 1) {
       retArr.push('webdev');
      }
      if (_.intersection(posi,designer).length >= 1 || _.intersection(desc,designer).length >= 1) {
       retArr.push('designer');
      }
      if (_.intersection(posi,fullstack).length >= 1 || _.intersection(desc,fullstack).length >= 1) {
       retArr.push('fullstack');
      }
      if (_.flatten(retArr).length === 0) retArr.push('other');
      return retArr;
    }
})

var retmas = function(desc){
  var descc = desc.split(/(\s+)/);
  descc = _.map(descc, function(word){return (word.toLowerCase());});
  descc = _.uniq(descc);
  descc = (  _.intersection(descc,_.keys(tagsObject)));
  descc = descc.map(function (descc) {
    return tagsObject[descc]
  });
  if (descc.length > 0) return descc;
  else{
    var ddesc = desc.replace(/[^\w\s]/gi, ' ');
    ddesc = ddesc.split(/\b/);
    ddesc = _.map(ddesc, function(word){return (word.toLowerCase());});
    ddesc = _.uniq(ddesc);
    ddesc = (  _.intersection(ddesc,_.keys(tagsObject)));
    ddesc = ddesc.map(function (ddesc) {
      return tagsObject[ddesc]
    });
    return ddesc;
  }
}
