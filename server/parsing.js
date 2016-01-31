var countZERO;

if (Posts.find().count() === 0) {
	countZERO = false;
}
else {
	countZERO = true;
}

parseWWR2 = function(){
	request("https://weworkremotely.com/categories/2-programming/jobs.xml", Meteor.bindEnvironment(function(error, response, body) {
	if (!error && response.statusCode == 200) {
		let $ = Cheerio.load(body);
		var parser = new xml2js.Parser(), tmp;
		parser.parseString($.xml(), function (err, result) {
			tmp = result.jobs.job.length-1;
			while (true) {

				//проверки
				let main_body = result.jobs.job[tmp];
				if (!main_body) return false;
				let apply_url = ('https://weworkremotely.com/jobs/' + main_body.id[0]._),
				post_exist = Posts.findOne({apply_url: apply_url});
				if (post_exist) return false;
				let same_post = Posts.findOne({position: main_body.title[0], company: main_body.company[0], createdAt : {$gte : (new Date()).addDays(-3)}});
				// конец проверок

				let description = UniHTML.purify(main_body.description[0]);
				if (!same_post){
					request(apply_url, Meteor.bindEnvironment(function(error, response, body) {
						let $ = Cheerio.load(body),
						image = $("div.listing-logo").children().attr('src');

						let metadata = {
							status: true,
							source: "wwr",
							position: main_body.title[0].replace(reg_r_brackets, "").replace(reg_r_tire,""),
							company: main_body.company[0].trim(),
							company_url: addhttp(main_body.url[0]),
							description: description,
							image:image,
							apply_url: 'https://weworkremotely.com/jobs/' + main_body.id[0]._,
							tags: makeTAG(main_body.title[0], [], description),
							category: makeCATEGORY(main_body.title[0], description)
						};

						let post_id = Posts.insert(metadata);
						if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
						console.log("WWR2 ADDED");
						if(!countZERO) return countZERO;
					}));
				}
				tmp--;
			}
		});
	}
	}));
}

parseWFH = function(){
	request("https://www.wfh.io/jobs.atom", Meteor.bindEnvironment(function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = Cheerio.load(body);
			var parser = new xml2js.Parser(), tmp;
			parser.parseString($.xml(), function (err, result) {
				tmp = 0;
				while (true) {

					let main_body = result.feed.entry[tmp];
					if (!main_body) return false;
					let apply_url = main_body.link[0].$.href,
					post_exist = Posts.findOne({apply_url: apply_url});
					if (post_exist) return false;

					var future = new Future();
					request(main_body.link[0].$.href, Meteor.bindEnvironment(function(error, response, body) {
						$ = Cheerio.load(body);
						let company = $("div.col-md-3").children('.panel').children('.panel-body').children().children().next().children().children().html(), company_url = urlapi.parse(company);
						company = company_url.hostname.split('.');
						company_url = company_url.href;
						if (company.length === 2) company = company[0].capitalize();
						else company = company[1].capitalize();

						var position = main_body.title[0].replace(reg_r_brackets, "").replace(reg_r_tire,'');
						company = company.trim();

						let same_post = Posts.findOne({position:position, company:company, createdAt : {$gte : (new Date()).addDays(-3)}});
						if (same_post) return false;

						let description =  UniHTML.purify(main_body.content[0]._);
						var metadata = {
							status: true,
							image:null,
							source: "wfh",
							position: position,
							company: company,
							company_url: addhttp(company_url),
							description:description,
							apply_url: main_body.link[0].$.href,
							tags: makeTAG(main_body.title[0], [],description),
							category: makeCATEGORY(main_body.title[0], description)
						};

						var post_id = Posts.insert(metadata);
						if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
						console.log("WFH ADDED");

						tmp++;
						if (!countZERO) return countZERO;
						future.return(true);
					}));
					var status = future.wait();
				}
			});
		}
	}));
}

parseWWM = function(){
	var tmp = 0,
	body = HTTP.call("GET","http://www.weworkmeteor.com/api/jobs");
	while (true){
		main_body = body.data.data[tmp];
		tmp++;
		if (tmp > body.data.data.length) return false;

		if(main_body.remote) {
			var postExist = Posts.findOne({apply_url: main_body.siteUrl});
			if (postExist) return false;

			let company_url = main_body.company_url,company = main_body.company,description = UniHTML.purify(main_body.htmlDescription);
			if (company_url === undefined) company_url = null;
			else company_url = addhttp(company_url);
			if (!company) company = "Private Project";

			var metadata = {
				status: true,
				source: "wwm",
				image:"METEOR",
				position: main_body.title.replace(reg_r_brackets, "").replace(reg_r_tire,''),
				company: company.trim(),
				company_url: company_url,
				description: description,
				apply_url: main_body.siteUrl,
				tags: makeTAG(main_body.title,['meteorjs'], description),
				category: makeCATEGORY(main_body.title, description)
			}

			var post_id = Posts.insert(metadata);
			if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
			console.log('WWM added')
			if(!countZERO) return countZERO;
		}
	}
}

parseDribbble = function(){
	request("https://dribbble.com/jobs.rss", Meteor.bindEnvironment(function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = Cheerio.load(body);
			var parser = new xml2js.Parser(), tmp;
			parser.parseString($.xml(), function (err, result) {
				let RSS = result.rss.channel[0]["atom:link"][0];
				tmp = 0;
				while (true) {
					var main_body = RSS.item[tmp];
					if (!main_body) return false;

					if((main_body.title[0].toLowerCase().indexOf("anywhere") >= 0) || (main_body.title[0].toLowerCase().indexOf("remote") >=0)){

						let apply_url = main_body.guid[0],
						post_exist = Posts.findOne({apply_url: apply_url});
						if (post_exist) return false;

						//грязь
						var xxx = main_body.title[0];
						var bbbSecretWords = ["product","lead","senior","graphic","web","app","ui","ux","design"];
						var dribbbleSplited = main_body.title[0].split(/\b/);
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
						// конец грязи

						let company = main_body["dc:creator"][0].capitalize(), description = UniHTML.purify(main_body.title[0]),
						metadata = {
							status: true,
							image:"DRIBBBLE",
							source: "dribbble",
							position: positionBBB.replace(reg_r_brackets, "").replace(reg_r_tire,''),
							company: company.trim(),
							description: description,
							apply_url: apply_url,
							tags: makeTAG(positionBBB,tagsBBB,description),
							category: makeCATEGORY(positionBBB,description)
						}

						let post_id = Posts.insert(metadata);
						if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
						console.log ("BBB ADDED");
						if(!countZERO) return countZERO;
					}
					tmp++;
				}
			});
		}
	}));
}

parseBehance = function(){
	request("https://www.behance.net/joblist", Meteor.bindEnvironment(function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = Cheerio.load(body);
			$("div.job-location").each(function() {
				var divLocation = $(this);
				if (divLocation.text().toLowerCase().indexOf("anywhere") >= 0 || divLocation.text().toLowerCase().indexOf("remote") >= 0 || divLocation.text().toLowerCase().indexOf("любом") >= 0 ) {

					var behanceJobUrl = divLocation.parent().next().children('.job-title').children().attr('href'),
					post_exist, url1 = urlapi.parse(behanceJobUrl);

					if (Posts.findOne({source: "behance"})){
						if (Posts.findOne({mask_url: url1.pathname})) post_exist = true;
						else post_exist = false;
					}
					else post_exist = false;
					if (post_exist) return false;

					var future = new Future();
					request(behanceJobUrl, Meteor.bindEnvironment(function(error, response, body) {
						let $$ = Cheerio.load(body), image = $$('img.team-image').attr('src');
						if (image === "https://a3.behance.net/img/rendition/team/230.jpg") image = null;

						description = UniHTML.purify($$('.job-description').html()),
						metadata = {
							status: true,
							source: "behance",
							image:image,
							position: $$('.job-header-details ').children().eq(0).text().replace(reg_r_brackets, "").replace(reg_r_tire,''),
							company: $$('.company-name ').children().eq(0).text().trim(),
							description: description,
							apply_url: behanceJobUrl,
							mask_url: url1.pathname,
							tags: makeTAG($$('.job-header-details ').children().text(), [],description),
							category: makeCATEGORY($$('.job-header-details ').children().text(),description)
						}
						var post_id = Posts.insert(metadata);
						if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
						console.log("BEHANCE ADDED");
						if (!countZERO) return countZERO;
						future.return(true);
					}));
					var status = future.wait();
				}
			});
		}
	}));
}

parseGitHub = function(){
	var tmp = 0,
	bodyGIT = HTTP.call("GET","https://jobs.github.com/positions.json");
	while (true){
		parseGIT = bodyGIT.data[tmp];
		if (!parseGIT) return false;
		if (parseGIT.company.toLowerCase().indexOf("github")>=0) tmp++;
		else{
			if (parseGIT.location.toLowerCase().indexOf("remote")>=0 || parseGIT.location.toLowerCase().indexOf("anywhere")>=0){

				var postExist = Posts.findOne({apply_url: parseGIT.url});
				if (postExist) return false;

				var position = parseGIT.title.replace(reg_r_brackets, "").replace(reg_r_tire,''),
				company = parseGIT.company.trim();

				let same_post = Posts.findOne({position:position, company:company, createdAt : {$gte : (new Date()).addDays(-3)}});
				if (same_post) return false;
				let company_url = parseGIT.company_url !== null ? addhttp(parseGIT.company_url) : null;
				let description = UniHTML.purify(parseGIT.description),
				metadata = {
					status: true,
					source: "github",
					image: parseGIT.company_logo,
					type: parseGIT.type,
					position: position,
					company: company,
					company_url: addhttp(parseGIT.company_url),
					description: description,
					apply_url: parseGIT.url,
					tags: makeTAG(parseGIT.title, [], description),
					category: makeCATEGORY(parseGIT.title, description)
				}

				var post_id = Posts.insert(metadata);
				if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
				console.log ("GITHUB ADDED");
				if (!countZERO) return countZERO;
			}
			tmp++;
		}
	}
}

parseStackO = function(){
	request("http://careers.stackoverflow.com/jobs?allowsremote=true&sort=i", Meteor.bindEnvironment(function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = Cheerio.load(body);
			$("div.-title").each(function() {
				var stackBody = $(this).children().children('.job-link'),
				stackoLoc = "http://careers.stackoverflow.com"+ stackBody.attr('href'),
				postExist = Posts.findOne({apply_url: stackoLoc}),
				future = new Future(),
				mask_url = urlapi.parse(stackoLoc);

				mask_url = mask_url.pathname;
				if (postExist) return false;
				postExist = Posts.findOne({mask_url: mask_url});
				if (postExist) return false;

				request(stackoLoc, Meteor.bindEnvironment(function(error, response, body) {
					if (!body) return false;
					$$ = Cheerio.load(body);
					var description ="";
					for (var i=1;i<6;i++){
						var clas = $$('.jobdetail').children().eq(i).attr('class');
						if (clas && clas.indexOf('apply') >= 0){
							break;
						}
						description +=$$('.jobdetail').children().eq(i).html() ;
					}
					var company = $$('#hed').children('.employer').text().trim(),
					position =  $$('.h3').children('.job-link').text().replace(reg_r_brackets, "").replace(reg_r_tire,''),
					same_post = Posts.findOne({position:position, company:company, createdAt : {$gte : (new Date()).addDays(-3)}});
					if (same_post) return false;

					var description = UniHTML.purify(description);


					let image = $$('div.-logo').children().attr('src');
					image = image !== undefined ? image : null;

					let metadata = {
						status:true,
						source: "stack",
						image: image,
						position: position,
						company: company,
						company_url: addhttp($$('.jobdetail').children('#hed').children('.employer').attr('href')),
						description: description,
						apply_url: stackoLoc,
						mask_url: mask_url,
						tags: makeTAG($$('.h3').children('.job-link').text(),[],description),
						category: makeCATEGORY($$('.h3').children('.job-link').text(), description)
					}

					var post_id = Posts.insert(metadata);
					if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
					console.log("STACK ADDED");
					if (!countZERO) return countZERO;
					future.return(true);
				}));
				var status = future.wait();
			});
		}
	}));
}

parseAuthentic = function(){
	request("https://authenticjobs.com/#onlyremote=1", Meteor.bindEnvironment(function(error, response, body) {
		if (!error && response.statusCode == 200) {
			$ = Cheerio.load(body);
			$("span.location.anywhere").each(function() {
				if (!!$(this).parent().parent().attr('href')){

					var authUrl = ("https://authenticjobs.com" + $(this).parent().parent().attr('href')),
					postExist = Posts.findOne({apply_url: authUrl}),
					future = new Future();

					if (postExist) return false;
					request(authUrl, Meteor.bindEnvironment(function(error, response, body) {
						if (!body) return false;
						$$ = Cheerio.load(body);

						var position = $$('.role').children('h1').text().replace(reg_r_brackets, "").replace(reg_r_tire,''),
						company =  $$('.title').children().children().children().children('h2').text().trim();
						if (company === "") company = "Private Project";
						let same_post = Posts.findOne({position:position, company:company, createdAt : {$gte : (new Date()).addDays(-3)}});
						if (same_post) return false;

						let description = UniHTML.purify($$('#description').html()),
						company_url = $$('li.website').children('a').attr('href'),
						image = `https://authenticjobs.com${$$('li.website').children('img').attr('src')}`;
						if (company !== "Private Project") company_url = addhttp(company_url);
						
						let metadata = {
							status:true,
							source: "auth",
							image:image,
							position: position,
							company: company,
							company_url: company_url,
							description:description,
							apply_url: authUrl,
							tags: makeTAG($$('.role').children('h1').text(),[],description),
							category: makeCATEGORY($$('.role').children('h1').text(),description)
						}
						var post_id = Posts.insert(metadata);
						if (post_id) tweeet_create(metadata.company, metadata.position, post_id, metadata.tags);
						console.log("AUTHENTIC ADDED");
						if (!countZERO) return countZERO;
						future.return(true);
					}));
					var status = future.wait();
				}
			});
		}
	}));
}
