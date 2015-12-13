if (Meteor.isServer) {
var Cheerio = Meteor.npmRequire('cheerio');
var Future = Meteor.npmRequire('fibers/future');
var xml2js = Meteor.npmRequire('xml2js');
var urlapi = Meteor.npmRequire('url');
var Twit = Meteor.npmRequire('twit');

var T = new Twit({
	consumer_key: Meteor.settings.private.twitter.consumer_key, // API key
	consumer_secret: Meteor.settings.private.twitter.consumer_key_secret, // API secret
	access_token: Meteor.settings.private.twitter.access_token,
	access_token_secret: Meteor.settings.private.twitter.access_token_secret
});

addhttp = function (url) {
	if (!/^(f|ht)tps?:\/\//i.test(url)) {
		url = "http://" + url;
	}
	return url;
}

tweeet_create = function(company,position,id,tags){
  var tw_company = company.replace(/\s/g,"");
  var tw_position = position.replace(/ *\([^)]*\) */g, "");

  T.get('users/search', { q : tw_company , page :1 , count : 1}, function (err, data, response) {

    if (data.length > 0){
      tw_company = '@' + data[0].screen_name.toLowerCase();
    }

    var tw_tags = "", tw_url = ' remotewolfy.com/job/' + id;
    tags.forEach(function(tag){
      tw_tags += ' #' + tag;
    });

    var tweet_array = [
      '.' + tw_company + ' need some cool remote ' + tw_position   + tw_tags +  ' 📢 ' + tw_url ,
      '.' + tw_company + ' is looking for remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
      'Want to work like ' + tw_position + ' in ' + tw_company + ' ? ' + tw_tags + ' ➡ ' + tw_url,
      '.' + tw_company + ' wants to hire remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
      '.' + tw_company + ' seeking remote '  + tw_position   + tw_tags + ' 🌍 ' + tw_url ,
      'Want to be remote ' + tw_position + ' in ' + tw_company + ' ? ' + tw_tags + ' ➡ ' + tw_url,
      tw_position + ' in ' + tw_company + ' Interesting ? ' + tw_tags + ' 📢 ' + tw_url,
      'BOOM! Remote ' + tw_position + ' in ' + tw_company + ' Are you in ? ' + ' 📣 ' + tw_url ,
      'Do you know some 🌟 ' + tw_position + ' who can work in ' + tw_company + ' ? ' +  tw_url ,
      ' 🔥🔥🔥 remote ' + tw_position + ' in ' + tw_company + tw_tags + ' / ' + tw_url,
    ];

    var tweet_body = tweet_array[Math.floor(Math.random() * tweet_array.length)]
    tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");

    if (tweet_body.length > 140) {
      tweet_body = tweet_array[Math.floor(Math.random() * tweet_array.length)];
      tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");
    }

    if (tweet_body.length > 140) {
      tweet_body = '.' + tw_company + ' is hiring ' + tw_position + ' 📢 ' + tw_url;
      tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");
    }

    if (tweet_body.length > 140) {
      tweet_body = tw_position  + ' in ' + tw_company + ' ' + tw_url;
      tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");
    }

    if (tweet_body.length > 140) {
      tweet_body = 'We have interesting job in ' + tw_company + ' ' + tw_url;
      tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");
    }

    T.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
        if (err) console.log('! TWITTER | ' + err + tweet_body);
      });
  });
}


var countZERO;
if (Posts.find().count() === 0) {
  countZERO = false;
}
else countZERO = true;

Meteor.methods({

  parseWWR2: function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
      this.unblock();
      request("https://weworkremotely.com/categories/2-programming/jobs.xml", Meteor.bindEnvironment(function(error, response, body) {
        if (!error && response.statusCode == 200) {
          $ = Cheerio.load(body);
          var parser = new xml2js.Parser();
          var tmp;
          parser.parseString($.xml(), function (err, result) {
            tmp = result.jobs.job.length-1;
            while (true) {
              var wwrBody = result.jobs.job[tmp];
              if (!wwrBody) return false;

              var applyUrl = ('https://weworkremotely.com/jobs/'+wwrBody.id[0]._) ;
              postExist = Posts.findOne({applyUrl: applyUrl});
              if (postExist) return false;
              else{
                var same_post = Posts.findOne({position: wwrBody.title[0], company: wwrBody.company[0]});
                if (!same_post){
                  var metadata = {
                    status: true,
                    source: "wwr",
                    remote: true,
                    position: wwrBody.title[0].replace(/ *\([^)]*\) */g, ""),
                    company: wwrBody.company[0].replace(/^\s+|\s+$/g, ""),
                    companyUrl: addhttp(wwrBody.url[0]),
                    companyLoc: wwrBody.location[0] + " - " + "Anywhere/Remote",
                    fullContent: UniHTML.purify(wwrBody.description[0]),
                    applyUrl: 'https://weworkremotely.com/jobs/'+wwrBody.id[0]._,
                    sitePic: "pic WWR",
                    tag: Meteor.call("makeTAG",wwrBody.title[0], [],UniHTML.purify(wwrBody.description[0])),
                    category: Meteor.call("makeCategory",wwrBody.title[0], UniHTML.purify(wwrBody.description[0]))
                  };
                  var post_id = Posts.insert(metadata);
                  if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tag);
                  console.log("WWR2 ADDED");
                  if(!countZERO) return countZERO;
                }
                tmp--;
              }
            }
          });
        }
      }));
  },
  parseWFH:function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
    this.unblock();
    request("https://www.wfh.io/jobs.atom", Meteor.bindEnvironment(function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = Cheerio.load(body);
        var parser = new xml2js.Parser();
        var tmp;
        parser.parseString($.xml(), function (err, result) {
          tmp = 0;
          while (true) {
            var wfhBody = result.feed.entry[tmp];
            if (!wfhBody) return false;
            else {
              var applyUrl = wfhBody.link[0].$.href;
              var postExist = Posts.findOne({applyUrl: applyUrl});
              if (!postExist){

                var futWFH = new Future();
                var r = request(wfhBody.link[0].$.href, Meteor.bindEnvironment(function(error, response, body) {
                    $ = Cheerio.load(body);
                    company  = $("div.col-md-3").children().children().children().children().next().children().children().html();
                    url = urlapi.parse(company);
                    company = url.hostname.split('.');
                    url = url.href;
                    if (company.length === 2) company = company[0].capitalize();
                    else company = company[1].capitalize();
                    if (!Posts.findOne({position:wfhBody.title[0], company:company})){
                      var metadata = {
                        status: true,
                        source: "wfh",
                        remote: true,
                        position: wfhBody.title[0].replace(/ *\([^)]*\) */g, ""),
                        company: company.replace(/^\s+|\s+$/g, ""),
                        companyLoc: "Anywhere/Remote",
                        companyUrl: addhttp(url),
                        fullContent: UniHTML.purify(wfhBody.content[0]._),
                        applyUrl: wfhBody.link[0].$.href,
                        sitePic: "pic WFH",
                        tag: Meteor.call("makeTAG",wfhBody.title[0], [],UniHTML.purify(wfhBody.content[0]._)),
                        category: Meteor.call("makeCategory",wfhBody.title[0], UniHTML.purify(wfhBody.content[0]._))
                      };
                      var post_id = Posts.insert(metadata);
                      if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tag);
                      console.log("WFH ADDED");
                    }
                    tmp++;
                    if (!countZERO) return countZERO;
                    else futWFH.return(true);
                }));
                var status = futWFH.wait();
              }
              else return false;
            }
          }
        });
      }
    }));
  },
  parseWWM: function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
    this.unblock();
    var tmp = 0;
    var bodyWWM = ((HTTP.call("GET","http://www.weworkmeteor.com/api/jobs")));
    while (true){
      parseWWM = bodyWWM.data.data[tmp];
      tmp++;
      if (tmp > bodyWWM.data.data.length) return false;
      if(parseWWM.remote) {
        var postExist = Posts.findOne({applyUrl: parseWWM.siteUrl});
        if (!postExist){
            var companyUrl = parseWWM.companyUrl;
            if (companyUrl === undefined) companyUrl = "";
            var company = parseWWM.company;
            if (!company) company = "Private Project";
            var companyLoc;
            if (parseWWM.remote) companyLoc = "Anywhere/Remote";
            else companyLoc = parseWWM.location;
            var metadata = {
              status: true,
              source: "wwm",
              remote: parseWWM.remote,
              position: parseWWM.title.replace(/ *\([^)]*\) */g, ""),
              company: company.replace(/^\s+|\s+$/g, ""),
              companyUrl: addhttp(companyUrl),
              companyLoc: companyLoc,
              fullContent: UniHTML.purify(parseWWM.htmlDescription),
              applyUrl: parseWWM.siteUrl,
              sitePic: "pic WWM",
              tag: Meteor.call("makeTAG",parseWWM.title,['meteorjs'], UniHTML.purify(parseWWM.htmlDescription)),
              category: Meteor.call("makeCategory",parseWWM.title, UniHTML.purify(parseWWM.htmlDescription))
            }
            var post_id = Posts.insert(metadata);
            if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tag);
            console.log('WWM added')
            if(!countZERO) return countZERO;
        }
        else return false;
      }
    }
  },
  parseDribbble: function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
    this.unblock();
    request("https://dribbble.com/jobs.rss", Meteor.bindEnvironment(function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = Cheerio.load(body);
        var parser = new xml2js.Parser();
        var tmp;
        parser.parseString($.xml(), function (err, result) {
          var dribbbleRSS = result.rss.channel[0]["atom:link"][0];
          tmp = 0;
          while (true) {
            var dribbbleBody = dribbbleRSS.item[tmp];
            if (!dribbbleBody) return false;
            if((dribbbleBody.title[0].toLowerCase().indexOf("anywhere") >= 0) || (dribbbleBody.title[0].toLowerCase().indexOf("remote") >=0)){
              var applyUrl = dribbbleBody.guid[0];
              var postExist = Posts.findOne({applyUrl: applyUrl});
              if (!postExist){
                var companyLoc = "";
                var xxx = dribbbleBody.title[0];
                var remote;
                remote = true;
                companyLoc = "Anywhere/Remote" ;
                var bbbSecretWords = ["product","lead","senior","graphic","web","app","ui","ux","design"];
                var dribbbleSplited = dribbbleBody.title[0].split(/\b/);
                dribbbleSplited = _.map(dribbbleSplited, function(word){return (word.toLowerCase());});
                dribbbleSplited = _.intersection(dribbbleSplited,bbbSecretWords);
                dribbbleSplited = _.map(dribbbleSplited, function(word){return (word.toLowerCase());});
                var tagsBBB = [];
                if (dribbbleSplited.length > 2) tagsBBB = _.last(dribbbleSplited, [3]);
                else if (dribbbleSplited.length > 1) tagsBBB = _.last(dribbbleSplited, [2]);
                else tagsBBB = ["design"];
                var positionBBB ="";
                if (xxx.indexOf('esigner ') != -1){
                  positionBBB = (xxx.substring((xxx.indexOf('hiring a')+9 ), (xxx.indexOf('esigner '))+8));
                }
                else if ((xxx.indexOf('esigner ')) != -1){
                  positionBBB = (xxx.substring((xxx.indexOf('hiring an')+9 ), (xxx.indexOf('anywhere ')-1)));
                }
                else if ((xxx.indexOf('anywhere ')) != -1){
                  positionBBB = (xxx.substring((xxx.indexOf('hiring a')+9 ), (xxx.indexOf('anywhere ')-1)));
                }
                else if ((xxx.indexOf(' in ')) != -1){
                  positionBBB = (xxx.substring((xxx.indexOf('hiring a')+9 ), (xxx.indexOf(' in '))));
                }
                else {
                  positionBBB = "Designer";
                }

                var company = dribbbleBody["dc:creator"][0].capitalize();
                  var metadata = {
                    status: true,
                    source: "dribbble",
                    remote: remote,
                    position: positionBBB.replace(/ *\([^)]*\) */g, ""),
                    company: company.replace(/^\s+|\s+$/g, ""),
                    companyLoc: companyLoc,
                    fullContent: UniHTML.purify(dribbbleBody.title[0]),
                    applyUrl: applyUrl,
                    sitePic: "fa fa-dribbble",
                    tag: Meteor.call("makeTAG",positionBBB,tagsBBB,UniHTML.purify(dribbbleBody.title[0])),
                    category: Meteor.call("makeCategory",positionBBB, UniHTML.purify(dribbbleBody.title[0]))
                  }
                  var post_id = Posts.insert(metadata);
                  if (post_id) tweeet_create(metadata.company, metadata.position, post_id,  metadata.tag);
                  console.log ("BBB ADDED");

                tmp++;
                if(!countZERO) return countZERO;
              }
              else return false;
            }
            else tmp++;
          }
        });
      }
    }));
  },
  parseBehance:function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
    this.unblock();
    request("https://www.behance.net/joblist", Meteor.bindEnvironment(function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = Cheerio.load(body);
        $("div.job-location").each(function() {
          var divLocation = $(this);
          if (divLocation.text().toLowerCase().indexOf("anywhere") >= 0 || divLocation.text().toLowerCase().indexOf("remote") >= 0 || divLocation.text().toLowerCase().indexOf("любом") >= 0 ) {
            var behanceJobUrl = divLocation.parent().next().children('.job-title').children().attr('href');
            var postExist;
            var url1 = urlapi.parse(behanceJobUrl);
            if (Posts.findOne({source: "behance"})){
              if (Posts.findOne({maskUrl: url1.pathname})) postExist = true;
              else postExist = false;
            }
            else postExist = false;
            if (!postExist ){
                var futBehance = new Future();
                request(behanceJobUrl, Meteor.bindEnvironment(function(error, response, body) {
                  $$ = Cheerio.load(body);
                  var remote;
                  var companyLoc = "";
                    remote = true;
                    companyLoc = "Anywhere/Remote";
                  var metadata = {
                    status: true,
                    source: "behance",
                    remote: remote,
                    position: $$('.job-header-details ').children().eq(0).text().replace(/ *\([^)]*\) */g, ""),
                    company: $$('.company-name ').children().eq(0).text().replace(/^\s+|\s+$/g, ""),
                    companyLoc: companyLoc,
                    fullContent: UniHTML.purify($$('.job-description').html()),
                    applyUrl: behanceJobUrl,
                    maskUrl: url1.pathname,
                    sitePic: "fa fa-behance",
                    tag: Meteor.call("makeTAG",$$('.job-header-details ').children().text(), [],UniHTML.purify($$('.job-description').html())),
                    category: Meteor.call("makeCategory",$$('.job-header-details ').children().text(),UniHTML.purify($$('.job-description').html()))
                  }
                  var post_id = Posts.insert(metadata);
                  if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tag);
                  console.log("BEHANCE ADDED");
                  if (!countZERO) return countZERO;
                  else futBehance.return(true);
                }));
              var status = futBehance.wait();
            }
            else return false;
          }
        });
      }
    }));
  },
  parseGitHub:function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
    this.unblock();
    var tmp = 0;
    var bodyGIT = ((HTTP.call("GET","https://jobs.github.com/positions.json")));
    while (true){
      parseGIT = bodyGIT.data[tmp];
      if (!parseGIT) return false;
      if (parseGIT.company.toLowerCase().indexOf("github")>=0) tmp++;
      else{
        if (parseGIT.location.toLowerCase().indexOf("remote")>=0 || parseGIT.location.toLowerCase().indexOf("anywhere")>=0){
          var postExist = Posts.findOne({applyUrl: parseGIT.url});
          if (!postExist){
            var remote;
            var companyLoc = "";
            remote = true;
            companyLoc = "Anywhere/Remote";
            if (!Posts.findOne({position:parseGIT.title, company:parseGIT.company})){
              var metadata = {
                status: true,
                source: "github",
                remote: remote,
                type: parseGIT.type,
                position: parseGIT.title.replace(/ *\([^)]*\) */g, ""),
                company: parseGIT.company.replace(/^\s+|\s+$/g, ""),
                companyUrl: addhttp(parseGIT.company_url),
                companyLoc: companyLoc,
                fullContent: UniHTML.purify(parseGIT.description),
                applyUrl: parseGIT.url,
                sitePic: "fa fa-github",
                tag: Meteor.call("makeTAG",parseGIT.title, [],UniHTML.purify(parseGIT.description)),
                category: Meteor.call("makeCategory",parseGIT.title, UniHTML.purify(parseGIT.description))
              }
              var post_id = Posts.insert(metadata);
              if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tag);
              console.log ("GITHUB ADDED");
            }
            tmp++;
            if (!countZERO) return countZERO;
          }
          else return false;
        }
        else tmp++;
      }
    }
  },
  parseStackO:function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
    this.unblock();
    request("http://careers.stackoverflow.com/jobs?allowsremote=true&sort=i", Meteor.bindEnvironment(function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = Cheerio.load(body);
        $("div.-title").each(function() {
          var stackBody = $(this).children().children('.job-link');
          var stackoLoc = "http://careers.stackoverflow.com"+ stackBody.attr('href');
          var postExist = Posts.findOne({applyUrl: stackoLoc});
          var futStackO = new Future();
          if (!postExist ){
            request(stackoLoc, Meteor.bindEnvironment(function(error, response, body) {
              $$ = Cheerio.load(body);
              var description ="";
              for (var i=1;i<6;i++){
                var clas = $$('.jobdetail').children().eq(i).attr('class');
              	if (clas && clas.indexOf('apply') >= 0){
              		break;
              	}
                description +=$$('.jobdetail').children().eq(i).html() ;
              }
              var tags = [];
              for (var j=0;j<3;j++)
                tags [j] = ($$('.tags').children().children().eq(j).text().toLowerCase());
              tags = _.compact(tags);
              var companyLoc = "";
              var remote;
              remote = true;
              var company = $$('#hed').children('.employer').text();
              var position =  $$('.h3').children('.job-link').text().replace(/ *\([^)]*\) */g, "");
              if (!Posts.findOne({position:position, company:company})){
                var metadata = {
                  status:true,
                  source: "stack",
                  remote: remote,
                  position: position,
                  company: company.replace(/^\s+|\s+$/g, ""),
                  companyLoc: $$('#hed').children('.location').text(),
                  companyUrl: addhttp($$('.jobdetail').children('#hed').children('.employer').attr('href')),
                  fullContent: UniHTML.purify(description),
                  applyUrl: stackoLoc,
                  sitePic: "fa fa-stack-overflow",
                  tag: Meteor.call("makeTAG",$$('.h3').children('.job-link').text(),[],UniHTML.purify(description)),
                  category: Meteor.call("makeCategory",$$('.h3').children('.job-link').text(), UniHTML.purify(description))
                }
                var post_id = Posts.insert(metadata);
                if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tag);
                console.log("STACK ADDED");
              }
              if (!countZERO) return countZERO;
              else futStackO.return(true);
            }));
            var status = futStackO.wait();
          }
          else return false;
        });
      }
    }));
  },
  parseAuthentic:function(lolipop){
    check(lolipop, String);
    if (lolipop != Meteor.settings.private.admin.key) return false;
    this.unblock();
    request("https://authenticjobs.com/#onlyremote=1", Meteor.bindEnvironment(function(error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = Cheerio.load(body);
        $("span.location.anywhere").each(function() {
          if (!!$(this).parent().parent().attr('href')){
            var authLocation = $(this).attr('class');
            var authUrl = ("https://authenticjobs.com" + $(this).parent().parent().attr('href'));
            var postExist = Posts.findOne({applyUrl: authUrl});
            var futAuth = new Future();
            if (!postExist ){
              request(authUrl, Meteor.bindEnvironment(function(error, response, body) {
                $$ = Cheerio.load(body);
                var companyLoc = "";
                var remote;
                remote = true;
                if ($$('#location').children().text().toLowerCase().indexOf('anywhere')>=0) companyLoc = "Anywhere/Remote";
                else companyLoc = $$('#location').children().text() + " - Anywhere/Remote";

                var position = $$('.role').children('h1').text();
                var company =  $$('.title').children().children().children().children('h2').text();
                if (company === "") company = "Private Project";
                if (!Posts.findOne({position:position, company:company})){
                  var metadata = {
                    status:true,
                    source: "auth",
                    remote: remote,
                    position: position.replace(/ *\([^)]*\) */g, ""),
                    company: company.replace(/^\s+|\s+$/g, ""),
                    companyLoc: companyLoc,
                    fullContent: UniHTML.purify($$('#description').html()),
                    applyUrl: authUrl,
                    sitePic: "pic AUTHENTIC",
                    tag:  Meteor.call("makeTAG",$$('.role').children('h1').text(),[],UniHTML.purify($$('#description').html())),
                    category: Meteor.call("makeCategory",$$('.role').children('h1').text(), UniHTML.purify($$('#description').html()))
                  }
                  var post_id = Posts.insert(metadata);
                  if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tag);
                  console.log("AUTHENTIC ADDED");
                }
                if (!countZERO) return countZERO;
                else futAuth.return(true);
              }));
              var status = futAuth.wait();
            }
            else return false;
          }
        });
      }
    }));
  }

});

}
