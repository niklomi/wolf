var T = new Twit({
	consumer_key: Meteor.settings.private.twitter.consumer_key,
	consumer_secret: Meteor.settings.private.twitter.consumer_key_secret,
	access_token: Meteor.settings.private.twitter.access_token,
	access_token_secret: Meteor.settings.private.twitter.access_token_secret
});

var t_nodejs = new Twit({
	consumer_key: Meteor.settings.private.t_nodejs.consumer_key,
	consumer_secret: Meteor.settings.private.t_nodejs.consumer_key_secret,
	access_token: Meteor.settings.private.t_nodejs.access_token,
	access_token_secret: Meteor.settings.private.t_nodejs.access_token_secret
});

var t_java = new Twit({
	consumer_key: Meteor.settings.private.t_java.consumer_key,
	consumer_secret: Meteor.settings.private.t_java.consumer_key_secret,
	access_token: Meteor.settings.private.t_java.access_token,
	access_token_secret: Meteor.settings.private.t_java.access_token_secret
});

var t_meteorjs = new Twit({
	consumer_key: Meteor.settings.private.t_meteorjs.consumer_key,
	consumer_secret: Meteor.settings.private.t_meteorjs.consumer_key_secret,
	access_token: Meteor.settings.private.t_meteorjs.access_token,
	access_token_secret: Meteor.settings.private.t_meteorjs.access_token_secret
});

var t_php = new Twit({
	consumer_key: Meteor.settings.private.t_php.consumer_key,
	consumer_secret: Meteor.settings.private.t_php.consumer_key_secret,
	access_token: Meteor.settings.private.t_php.access_token,
	access_token_secret: Meteor.settings.private.t_php.access_token_secret
});

var t_android = new Twit({
	consumer_key: Meteor.settings.private.t_android.consumer_key,
	consumer_secret: Meteor.settings.private.t_android.consumer_key_secret,
	access_token: Meteor.settings.private.t_android.access_token,
	access_token_secret: Meteor.settings.private.t_android.access_token_secret
});

var t_dotnet = new Twit({
	consumer_key: Meteor.settings.private.t_dotnet.consumer_key,
	consumer_secret: Meteor.settings.private.t_dotnet.consumer_key_secret,
	access_token: Meteor.settings.private.t_dotnet.access_token,
	access_token_secret: Meteor.settings.private.t_dotnet.access_token_secret
});

var t_ios = new Twit({
	consumer_key: Meteor.settings.private.t_ios.consumer_key,
	consumer_secret: Meteor.settings.private.t_ios.consumer_key_secret,
	access_token: Meteor.settings.private.t_ios.access_token,
	access_token_secret: Meteor.settings.private.t_ios.access_token_secret
});

let twit_body = function(data,tw_company,tw_position,tags,id){
	if (data.length > 0){
		tw_company = '.@' + data[0].screen_name.toLowerCase();
	}

	var tw_tags = "", tw_url = ' remotewolfy.com/job/' + id;
	if (tags){
		tags.forEach(function(tag){
			tw_tags += ' #' + tag;
		});
	}
	else tags = "";

	var tweet_array = [
		tw_company + ' need some cool remote ' + tw_position   + tw_tags +  ' 📢 ' + tw_url ,
		tw_company + ' is looking for remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
		'Want to work like ' + tw_position + ' in ' + tw_company + ' ? ' + tw_tags + ' ➡ ' + tw_url,
		tw_company + ' wants to hire remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
		tw_company + ' seeking remote '  + tw_position   + tw_tags + ' 🌍 ' + tw_url ,
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

	return tweet_body;
}

tweeet_create = function(company,position,id,tags){
	var tw_company = company.replace(/\s/g,"");
	var tw_position = position.trim();

	T.get('users/search', { q : tw_company , page :1 , count : 1}, function (err, data, response) {
		let tweet_body = twit_body(data,tw_company,tw_position,tags,id);
		if (inProduction()){
			T.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
				if (err) console.log('! TWITTER | ' + err + tweet_body);
			});
			if (tags.indexOf('nodejs') >= 0){
				t_nodejs.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! TWITTER | ' + err + tweet_body);
				});
			}
			if (tags.indexOf('java') >= 0 || tags.indexOf('android') >= 0 || tags.indexOf('groovy') >= 0){
				t_java.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! TWITTER | ' + err + tweet_body);
				});
			}
			if (tags.indexOf('meteorjs') >= 0){
				t_meteorjs.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! TWITTER | ' + err + tweet_body);
				});
			}
			if (tags.indexOf('php') >= 0 || tags.indexOf('cakephp') >= 0 || tags.indexOf('symfony') >= 0){
				t_php.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! TWITTER | ' + err + tweet_body);
				});
			}
			if (tags.indexOf('android') >= 0){
				t_android.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! TWITTER | ' + err + tweet_body);
				});
			}
			if (tags.indexOf('net') >= 0 || tags.indexOf('c#') >= 0 || tags.indexOf('asp') >= 0){
				t_dotnet.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! TWITTER | ' + err + tweet_body);
				});
			}
			if (tags.indexOf('ios') >= 0 || tags.indexOf('swift') >= 0){
				t_ios.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! TWITTER | ' + err + tweet_body);
				});
			}
		}
	});
}
