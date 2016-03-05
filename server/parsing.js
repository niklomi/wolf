let countZERO;

if (Posts.find().count() === 0) {
  countZERO = false;
} else {
  countZERO = true;
}

__insertJobModule = function(data){
  let {position, company, source} = data;
  if (!position || position === '') {
    Slack.send({
      text: `${source} Position Error:
      position - ${position}`
    });
  } else if(!company || company === ''){
    Slack.send({
      text: `${source} Company
      Error: company - ${company}`
    });
  } else {
    data.createdAt = new Date();
    data.url = makeUrl(data);
    let postId = Posts.insert(data);
    if (postId) tweeet_create(company, position, postId, data.tags, data.url);
    console.log(`Add ${source} - ${moment().format('MMM Do YY, h:mm:ss')}`);
  }
};

parseWWR2 = function() {
  request('https://weworkremotely.com/categories/2-programming/jobs.xml', Meteor.bindEnvironment(function(error, response, body) {
  if (!error && response.statusCode === 200) {
    let $ = Cheerio.load(body);
    let parser = new xml2js.Parser(), tmp;
    parser.parseString($.xml(), function(err, result) {
      tmp = result.jobs.job.length - 1;
      while(true) {
        //проверки
        let mainBodyData = result.jobs.job[tmp];
        if (!mainBodyData) return false;
        let apply_url = ('https://weworkremotely.com/jobs/' + mainBodyData.id[0]._),
        postExist = Posts.findOne({apply_url: apply_url});
        if (postExist) return false;
        let position = mainBodyData.title[0].replace(reg_r_brackets, '').replace(reg_r_tire, ''),
        company = mainBodyData.company[0].trim(),
        description = UniHTML.purify(mainBodyData.description[0]),
        samePost = Posts.findOne({position: position, company: company, createdAt: {$gte: (new Date()).addDays(-3)}});
        // конец проверок

        if (!samePost) {
          request(apply_url, Meteor.bindEnvironment( (error, response, body) => {
            let $ = Cheerio.load(body),
            image = $('div.listing-logo').children().attr('src');

            let metadata = {
              status: true,
              source: 'wwr',
              position,
              company,
              company_url: addhttp(mainBodyData.url[0]),
              description,
              image,
              apply_url: 'https://weworkremotely.com/jobs/' + mainBodyData.id[0]._,
              tags: __makeTAG(mainBodyData.title[0], [], description),
              category: __makeCATEGORY(mainBodyData.title[0], description)
            };

            __insertJobModule(metadata);
            if(!countZERO) return countZERO;
          }));
        }
        tmp--;
      }
    });
  }
  }));
};

parseWFH = function() {
  request('https://www.wfh.io/jobs.atom', Meteor.bindEnvironment(function(error, response, body) {
    if (!error && response.statusCode === 200) {
      $ = Cheerio.load(body);
      let parser = new xml2js.Parser(), tmp;
      parser.parseString($.xml(), function(err, result) {
        tmp = 0;
        while(true) {
          let mainBodyData = result.feed.entry[tmp];
          if (!mainBodyData) return false;
          let apply_url = mainBodyData.link[0].$.href,
          postExist = Posts.findOne({apply_url: apply_url});
          if (postExist) return false;

          let future = new Future();
          request(mainBodyData.link[0].$.href, Meteor.bindEnvironment(function(error, response, body) {
            $ = Cheerio.load(body);
            let company = $('div.col-md-3').children('.panel').children('.panel-body').children().children().next().children().children().html(),
            company_url = urlapi.parse(company);
            company = company_url.hostname.split('.');
            company_url = company_url.href;
            if (company.length === 2) company = company[0].capitalize();
            else company = company[1].capitalize();

            let  position = mainBodyData.title[0].replace(reg_r_brackets, '').replace(reg_r_tire, '');
            company = company.trim();

            let samePost = Posts.findOne({position: position, company: company, createdAt: {$gte: (new Date()).addDays(-3)}});
            if (samePost) return false;

            let description =  UniHTML.purify(mainBodyData.content[0]._),
            metadata = {
              status: true,
              image: null,
              source: 'wfh',
              position,
              company,
              company_url: addhttp(company_url),
              description,
              apply_url: mainBodyData.link[0].$.href,
              tags: __makeTAG(mainBodyData.title[0], [], description),
              category: __makeCATEGORY(mainBodyData.title[0], description)
            };

            __insertJobModule(metadata);

            tmp++;
            if (!countZERO) return countZERO;
            future.return(true);
          }));
          future.wait();
        }
      });
    }
  }));
};

parseWWM = function() {
  let tmp = 0,
  body = HTTP.call('GET', 'http://www.weworkmeteor.com/api/jobs');
  while(true) {
    mainBodyData = body.data.data[tmp];
    tmp++;
    if (tmp > body.data.data.length) return false;

    if(mainBodyData.remote) {
      let postExist = Posts.findOne({apply_url: mainBodyData.siteUrl});
      if (postExist) return false;

      let company_url = mainBodyData.company_url,
      company = mainBodyData.company,
      description = UniHTML.purify(mainBodyData.htmlDescription);

      if (company_url === undefined) company_url = null;
      else company_url = addhttp(company_url);
      if (!company) company = 'Private Project';

      let metadata = {
        status: true,
        source: 'wwm',
        image: 'METEOR',
        position: mainBodyData.title.replace(reg_r_brackets, '').replace(reg_r_tire, ''),
        company: company.trim(),
        company_url,
        description,
        apply_url: mainBodyData.siteUrl,
        tags: __makeTAG(mainBodyData.title, ['meteorjs'], description),
        category: __makeCATEGORY(mainBodyData.title, description)
      };

      __insertJobModule(metadata);
      if(!countZERO) return countZERO;
    }
  }
};

parseDribbble = function() {
  request('https://dribbble.com/jobs.rss', Meteor.bindEnvironment(function(error, response, body) {
    if (!error && response.statusCode === 200) {
      $ = Cheerio.load(body);
      let parser = new xml2js.Parser(), tmp;
      parser.parseString($.xml(), function(err, result) {
        let RSS = result.rss.channel[0]['atom:link'][0];
        tmp = 0;
        while (true) {
          let mainBodyData = RSS.item[tmp];
          if (!mainBodyData) return false;

          if((mainBodyData.title[0].toLowerCase().indexOf('anywhere') >= 0) || (mainBodyData.title[0].toLowerCase().indexOf('remote') >= 0)) {
            let apply_url = mainBodyData.guid[0],
            postExist = Posts.findOne({apply_url: apply_url});
            if (postExist) return false;

            //грязь
            let xxx = mainBodyData.title[0];
            let bbbSecretWords = ['product', 'lead', 'senior', 'graphic', 'web', 'app', 'design'];
            let dribbbleSplited = mainBodyData.title[0].split(/\b/);
            dribbbleSplited = _.map(dribbbleSplited, word => word.toLowerCase());
            dribbbleSplited = _.intersection(dribbbleSplited, bbbSecretWords);
            dribbbleSplited = _.map(dribbbleSplited, word => word.toLowerCase());
            let tagsBBB = [];
            if (dribbbleSplited.length > 2) tagsBBB = _.last(dribbbleSplited, [3]);
            else if (dribbbleSplited.length > 1) tagsBBB = _.last(dribbbleSplited, [2]);
            else tagsBBB = ['design'];
            let positionBBB = '';
            if (xxx.indexOf('esigner ') !== -1 ) {
              positionBBB = (xxx.substring((xxx.indexOf('hiring a') + 9 ), (xxx.indexOf('esigner ')) + 8));
            } else if (xxx.indexOf('esigner ') !== -1) {
              positionBBB = (xxx.substring((xxx.indexOf('hiring an') + 9 ), (xxx.indexOf('anywhere ') - 1)));
            } else if (xxx.indexOf('anywhere ') !== -1 ) {
              positionBBB = (xxx.substring((xxx.indexOf('hiring a') + 9 ), (xxx.indexOf('anywhere ') - 1)));
            } else if (xxx.indexOf(' in ') !== -1 ) {
              positionBBB = (xxx.substring((xxx.indexOf('hiring a') + 9 ), (xxx.indexOf(' in '))));
            } else {
              positionBBB = 'Designer';
            }
            // конец грязи

            let company = mainBodyData['dc:creator'][0].capitalize().trim(), description = UniHTML.purify(mainBodyData.title[0]),
            metadata = {
              status: true,
              image: 'DRIBBBLE',
              source: 'dribbble',
              position: positionBBB.replace(reg_r_brackets, '').replace(reg_r_tire, ''),
              company,
              description,
              apply_url,
              tags: __makeTAG(positionBBB, tagsBBB, description),
              category: __makeCATEGORY(positionBBB, description)
            };

            __insertJobModule(metadata);
            if(!countZERO) return countZERO;
          }
          tmp++;
        }
      });
    }
  }));
};

parseBehance = function() {
  request('https://www.behance.net/joblist', Meteor.bindEnvironment(function(error, response, body) {
    if (!error && response.statusCode === 200) {
      $ = Cheerio.load(body);
      $('div.job-location').each(function() {
        let divLocation = $(this),
        wordRemote = divLocation.text().toLowerCase();
        if (wordRemote.indexOf('anywhere') >= 0 || wordRemote.indexOf('remote') >= 0 || wordRemote.indexOf('любом') >= 0 ) {
          let apply_url = divLocation.parent().next().children('.job-title').children().attr('href'),
          postExist, url1 = urlapi.parse(apply_url);

          if (Posts.findOne({source: 'behance'})) {
            if (Posts.findOne({maskLink: url1.pathname})) postExist = true;
            else postExist = false;
          } else postExist = false;
          if (postExist) return false;

          let future = new Future();
          request(apply_url, Meteor.bindEnvironment(function(error, response, body) {
            let $$ = Cheerio.load(body), image = $$('img.team-image').attr('src');
            if (image === 'https://a3.behance.net/img/rendition/team/230.jpg') image = null;

            let description = UniHTML.purify($$('.job-description').html()),
            metadata = {
              status: true,
              source: 'behance',
              image,
              position: $$('.job-header-details ').children().eq(0).text().replace(reg_r_brackets, '').replace(reg_r_tire, ''),
              company: $$('.company-name ').children().eq(0).text().trim(),
              description,
              apply_url,
              maskLink: url1.pathname,
              tags: __makeTAG($$('.job-header-details ').children().text(), [], description),
              category: __makeCATEGORY($$('.job-header-details ').children().text(), description)
            };

            __insertJobModule(metadata);
            if (!countZERO) return countZERO;
            future.return(true);
          }));
          future.wait();
        }
      });
    }
  }));
};

parseGitHub = function() {
  let tmp = 0,
  bodyGIT = HTTP.call('GET', 'https://jobs.github.com/positions.json');
  while(true) {
    parseGIT = bodyGIT.data[tmp];
    if (!parseGIT) return false;
    if (parseGIT.company.toLowerCase().indexOf('github') >= 0) tmp++;
    else{
      if (parseGIT.location.toLowerCase().indexOf('remote') >= 0 || parseGIT.location.toLowerCase().indexOf('anywhere') >= 0) {
        let postExist = Posts.findOne({apply_url: parseGIT.url});
        if (postExist) return false;

        let position = parseGIT.title.replace(reg_r_brackets, '').replace(reg_r_tire, ''),
        company = parseGIT.company.trim();

        let samePost = Posts.findOne({position: position, company: company, createdAt: {$gte: (new Date()).addDays(-3)}});
        if (samePost) return false;
        let company_url = parseGIT.company_url !== null ? addhttp(parseGIT.company_url) : null,
        description = UniHTML.purify(parseGIT.description),
        metadata = {
          status: true,
          source: 'github',
          image: parseGIT.company_logo,
          type: parseGIT.type,
          position,
          company,
          company_url,
          description,
          apply_url: parseGIT.url,
          tags: __makeTAG(parseGIT.title, [], description),
          category: __makeCATEGORY(parseGIT.title, description)
        };

        __insertJobModule(metadata);
        if (!countZERO) return countZERO;
      }
      tmp++;
    }
  }
};

parseStackO = function() {
  request('http://careers.stackoverflow.com/jobs?allowsremote=true&sort=i', Meteor.bindEnvironment(function(error, response, body) {
    if (!error && response.statusCode === 200) {
      $ = Cheerio.load(body);
      $('div.-title').each(function() {
        let stackBody = $(this).children().children('.job-link'),
        stackoLoc = 'http://careers.stackoverflow.com' + stackBody.attr('href'),
        postExist = Posts.findOne({apply_url: stackoLoc}),
        future = new Future(),
        maskLink = urlapi.parse(stackoLoc);

        maskLink = maskLink.pathname;
        if (postExist) return false;
        postExist = Posts.findOne({maskLink: maskLink});
        if (postExist) return false;

        request(stackoLoc, Meteor.bindEnvironment(function(error, response, body) {
          if (!body) return false;
          $$ = Cheerio.load(body);
          let description = '';
          for (let i = 1; i < 6; i++) {
            let clas = $$('.jobdetail').children().eq(i).attr('class');
            if (clas && clas.indexOf('apply') >= 0 ) {
              break;
            }
            description += $$('.jobdetail').children().eq(i).html();
          }
          let company = $$('#hed').find('.employer').text().trim(),
          position =  $$('.detail-jobTitle').children('.job-link').text().replace(reg_r_brackets, '').replace(reg_r_tire, ''),
          samePost = Posts.findOne({position: position, company: company, createdAt: {$gte: (new Date()).addDays(-3)}});
          if (samePost) return false;

          description = UniHTML.purify(description);
          let image = $$('div.-logo').children().attr('src');
          image = image !== undefined ? image : null;

          let metadata = {
            status: true,
            source: 'stack',
            image,
            position,
            company,
            company_url: addhttp($$('.jobdetail').children('#hed').children('.employer').attr('href')),
            description,
            apply_url: stackoLoc,
            maskLink,
            tags: __makeTAG($$('.h3').children('.job-link').text(), [], description),
            category: __makeCATEGORY($$('.h3').children('.job-link').text(), description)
          };

          __insertJobModule(metadata);
          if (!countZERO) return countZERO;
          future.return(true);
        }));
        future.wait();
      });
    }
  }));
};

parseAuthentic = function() {
  request('https://authenticjobs.com/#onlyremote=1', Meteor.bindEnvironment(function(error, response, body) {
    if (!error && response.statusCode === 200) {
      $ = Cheerio.load(body);
      $('span.location.anywhere').each(function() {
        if (!!$(this).parent().parent().attr('href')) {
          let apply_url = ('https://authenticjobs.com' + $(this).parent().parent().attr('href')),
          postExist = Posts.findOne({apply_url: apply_url}),
          future = new Future();

          if (postExist) return false;
          request(apply_url, Meteor.bindEnvironment(function(error, response, body) {
            if (!body) return false;
            $$ = Cheerio.load(body);

            let position = $$('.role').children('h1').text().replace(reg_r_brackets, '').replace(reg_r_tire, ''),
            company =  $$('.title').children().children().children().children('h2').text().trim();
            if (company === '') company = 'Private Project';
            let samePost = Posts.findOne({position: position, company: company, createdAt: {$gte: (new Date()).addDays(-3)}});
            if (samePost) return false;

            let description = UniHTML.purify($$('#description').html()),
            company_url = $$('li.website').children('a').attr('href'),
            image = `https://authenticjobs.com${$$('li.website').children('img').attr('src')}`;
            if (company !== 'Private Project') company_url = addhttp(company_url);

            let metadata = {
              status: true,
              source: 'auth',
              image,
              position,
              company,
              company_url,
              description,
              apply_url,
              tags: __makeTAG($$('.role').children('h1').text(), [], description),
              category: __makeCATEGORY($$('.role').children('h1').text(), description)
            };

            __insertJobModule(metadata);
            if (!countZERO) return countZERO;
            future.return(true);
          }));
          future.wait();
        }
      });
    }
  }));
};
