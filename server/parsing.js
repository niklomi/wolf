insertJob = function(data){
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
  HTTP.call("GET", 'https://weworkremotely.com/categories/2-programming/jobs.xml', function(error, body) {
  if (!error) {
    let $ = Cheerio.load(body.content);
    let parser = new xml2js.Parser(), tmp;
    parser.parseString($.xml(), function(err, result) {
      tmp = result.jobs.job.length - 1;

      (function loop(){
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
          HTTP.call("GET", apply_url, (error, body) => {
            let $ = Cheerio.load(body.content),
            image = $('div.listing-logo').children().attr('src');

            let metadata = {
              status: true,
              source: 'WeWorkRemote',
              position,
              company,
              company_url: addhttp(mainBodyData.url[0]),
              description,
              image,
              apply_url: 'https://weworkremotely.com/jobs/' + mainBodyData.id[0]._,
              tags: createTags(mainBodyData.title[0], [], description),
              category: createCategory(mainBodyData.title[0], description)
            };

            insertJob(metadata);
            if(Posts.find().count() === 0) return false;
          });
        }
        tmp--;
        loop();
      }());
    });
  }
  });
};

parseWFH = function() {
  HTTP.call("GET", 'https://www.wfh.io/jobs.atom', (error, body) => {
    if (!error) {
      let $ = Cheerio.load(body.content);
      let parser = new xml2js.Parser(), tmp;
      parser.parseString($.xml(), function(err, result) {
        tmp = 0;
        (function loop(){
          let mainBodyData = result.feed.entry[tmp];
          if (!mainBodyData) return false;
          let apply_url = mainBodyData.link[0].$.href,
          postExist = Posts.findOne({apply_url: apply_url});
          if (postExist) return false;

          HTTP.call("GET", mainBodyData.link[0].$.href, (error, body) => {
            let $$ = Cheerio.load(body.content);
            let company = $$('div.col-md-3').children('.panel').children('.panel-body').children().children().next().children().children().html(),
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
              source: 'WFH.io',
              position,
              company,
              company_url: addhttp(company_url),
              description,
              apply_url: mainBodyData.link[0].$.href,
              tags: createTags(mainBodyData.title[0], [], description),
              category: createCategory(mainBodyData.title[0], description)
            };

            insertJob(metadata);

            tmp++;
            if (Posts.find().count() === 0) return false;
            loop();
          });
        }());
      });
    }
  });
};

parseWWM = function() {
  let tmp = 0,
  body = HTTP.call('GET', 'http://www.weworkmeteor.com/api/jobs');
  (function loop(){
    let mainBodyData = body.data.data[tmp];
    tmp++;
    if (tmp > body.data.data.length) return false;
    if(mainBodyData.remote) {

      let postExist = Posts.findOne({apply_url: mainBodyData.siteUrl});
      if (postExist) return false;
      let company_url = mainBodyData.company_url,
      company = mainBodyData.company,
      description = UniHTML.purify(mainBodyData.htmlDescription);
      company_url = company_url ? addhttp(company_url) : null;
      if (!company) company = 'Private Project';
      let metadata = {
        status: true,
        source: 'WeWorkMeteor',
        image: 'METEOR',
        position: mainBodyData.title.replace(reg_r_brackets, '').replace(reg_r_tire, ''),
        company: company.trim(),
        company_url,
        description,
        apply_url: mainBodyData.siteUrl,
        tags: createTags(mainBodyData.title, ['meteorjs'], description),
        category: createCategory(mainBodyData.title, description)
      };

      insertJob(metadata);
      if(Posts.find().count() === 0) return false;
    }
    loop();
  }());
};

parseDribbble = function() {
  HTTP.call("GET", 'https://dribbble.com/jobs.rss', (error, body) => {
    if (!error) {
      let $ = Cheerio.load(body.content);
      let parser = new xml2js.Parser(), tmp;
      parser.parseString($.xml(), function(err, result) {
        let RSS = result.rss.channel[0]['atom:link'][0];
        tmp = 0;
        (function loop(){
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
              source: 'Dribbble',
              position: positionBBB.replace(reg_r_brackets, '').replace(reg_r_tire, ''),
              company,
              description,
              apply_url,
              tags: createTags(positionBBB, tagsBBB, description),
              category: createCategory(positionBBB, description)
            };

            insertJob(metadata);
            if(Posts.find().count() === 0) return false;
          }
          tmp++;
          loop();
        }());
      });
    }
  });
};

parseBehance = function() {
  HTTP.call("GET", 'https://www.behance.net/joblist', (error, body) => {
    if (!error) {
      let $ = Cheerio.load(body.content);
      $('div.job-location').each(function() {
        let divLocation = $(this),
        wordRemote = divLocation.text().toLowerCase();
        if (wordRemote.indexOf('anywhere') >= 0 || wordRemote.indexOf('remote') >= 0 || wordRemote.indexOf('любом') >= 0 ) {
          let apply_url = divLocation.parent().next().children('.job-title').children().attr('href'),
          postExist, url1 = urlapi.parse(apply_url);

          if (Posts.findOne({source: 'Behance'})) {
            if (Posts.findOne({maskLink: url1.pathname})) postExist = true;
            else postExist = false;
          } else postExist = false;
          if (postExist) return false;

          HTTP.call("GET", apply_url, (error, body) => {
            let $$ = Cheerio.load(body.content), image = $$('img.team-image').attr('src');
            if (image === 'https://a3.behance.net/img/rendition/team/230.jpg') image = null;

            let description = UniHTML.purify($$('.job-description').html()),
            metadata = {
              status: true,
              source: 'Behance',
              image,
              position: $$('.job-header-details ').children().eq(0).text().replace(reg_r_brackets, '').replace(reg_r_tire, ''),
              company: $$('.company-name ').children().eq(0).text().trim(),
              description,
              apply_url,
              maskLink: url1.pathname,
              tags: createTags($$('.job-header-details ').children().text(), [], description),
              category: createCategory($$('.job-header-details ').children().text(), description)
            };

            insertJob(metadata);
            if (Posts.find().count() === 0) return false;
          });
        }
      });
    }
  });
};

parseGitHub = function() {
  let tmp = 0,
  bodyGIT = HTTP.call('GET', 'https://jobs.github.com/positions.json');
  (function loop(){
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
          source: 'Github',
          image: parseGIT.company_logo,
          type: parseGIT.type,
          position,
          company,
          company_url,
          description,
          apply_url: parseGIT.url,
          tags: createTags(parseGIT.title, [], description),
          category: createCategory(parseGIT.title, description)
        };

        insertJob(metadata);
        if (Posts.find().count() === 0) return false;
      }
      tmp++;
    }
    loop();
  }());
};

parseStackO = function() {
  HTTP.call("GET", 'http://careers.stackoverflow.com/jobs?allowsremote=true&sort=i', (error, body) => {
    if (!error) {
      let $ = Cheerio.load(body.content);
      $('div.-title').each(function() {
        let stackBody = $(this).children().children('.job-link'),
        stackoLoc = stackBody.attr('href'),
        postExist = Posts.findOne({apply_url: stackoLoc}),
        maskLink = urlapi.parse(stackoLoc).pathname;
        if (postExist) return false;
        postExist = Posts.findOne({maskLink: maskLink});
        if (postExist) return false;
        HTTP.call("GET", stackoLoc, (error, body) => {
          if (!body.content) return false;
          let $$ = Cheerio.load(body.content),
          description = '';
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

          let image = $$('div.-logo').children().attr('src') ? $$('div.-logo').children().attr('src') : null;

          let metadata = {
            status: true,
            source: 'StackOverflow',
            image,
            position,
            company,
            company_url: addhttp($$('.jobdetail').children('#hed').children('.employer').attr('href')),
            description,
            apply_url: stackoLoc,
            maskLink,
            tags: createTags($$('.h3').children('.job-link').text(), [], description),
            category: createCategory($$('.h3').children('.job-link').text(), description)
          };

          insertJob(metadata);
          if (Posts.find().count() === 0) return false;
        });
      });
    }
  });
};

parseAuthentic = function() {
  HTTP.call("GET", 'https://authenticjobs.com/#onlyremote=1&remote=true', (error, body) => {
    if (!error) {
      let $ = Cheerio.load(body.content);
      $('ul#listings').children('li').each(function() {
        let apply_url = ('https://authenticjobs.com' + $(this).children('a').attr('href')),
        postExist = Posts.findOne({apply_url: apply_url});
        if (postExist) return false;
        let image = 'https://authenticjobs.com' + $(this).children('a').children('img').attr('src'),
        position = $(this).children('a').children('div.details').children('h3').text().trim(),
        company = $(this).children('a').children('div.details').children('h4').attr('title').trim();
        let samePost = Posts.findOne({position: position, company: company, createdAt: {$gte: (new Date()).addDays(-3)}});
        if (samePost) return false;

        HTTP.call("GET", apply_url, (error, body) => {
          if (!body.content) return false;
          let $$ = Cheerio.load(body.content);
          let description = UniHTML.purify($$('.description').html(), {withoutTags: ['img']}),
          company_url = addhttp($$('#the_company').children('header').children('a').attr('href'));
          let metadata = {
            status: true,
            source: 'Authentic',
            image,
            position,
            company,
            company_url,
            description,
            apply_url,
            tags: createTags($$('.role').children('h1').text(), [], description),
            category: createCategory($$('.role').children('h1').text(), description)
          };
          insertJob(metadata);
          if (Posts.find().count() === 0) return false;
        });
      });
    }
  });
};
