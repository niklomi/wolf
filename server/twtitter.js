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
	let company_body = "";
	if (data.length > 0){
		tw_company = '.@' + data[0].screen_name.toLowerCase();
		company_body = '@' + data[0].screen_name.toLowerCase();
	}

	var tw_tags = "", tw_url = ' remotewolfy.com/job/' + id;
	if (tags){
		tags.forEach(function(tag){
			if (tag === 'c#') tag = 'csharp';
			tw_tags += ' #' + tag;
		});
	}
	else tags = "";

	var tweet_array = [
		tw_company + ' need some cool remote ' + tw_position   + tw_tags +  ' 📢 ' + tw_url ,
		tw_company + ' is looking for remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
		'Want to work like ' + tw_position + ' in ' + company_body + ' ? ' + tw_tags + ' ➡ ' + tw_url,
		tw_company + ' wants to hire remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
		tw_company + ' seeking remote '  + tw_position   + tw_tags + ' 🌍 ' + tw_url ,
		'Want to be remote ' + tw_position + ' in ' + company_body + ' ? ' + tw_tags + ' ➡ ' + tw_url,
		tw_position + ' in ' + tw_company + ' Interesting ? ' + tw_tags + ' 📢 ' + tw_url,
		'BOOM! Remote ' + tw_position + ' in ' + company_body  + ' Are you in ? ' + ' 📣 ' + tw_url ,
		'Do you know some 🌟 ' + tw_position + ' who can work in ' + company_body + ' ? ' +  tw_url ,
		' 🔥🔥🔥 remote ' + tw_position + ' in ' + company_body  + tw_tags + ' / ' + tw_url,
	];

	var tweet_body = tweet_array[Math.floor(Math.random() * tweet_array.length)]
	tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");

	if (tweet_body.length > 140) {
		tweet_body = tweet_array[Math.floor(Math.random() * tweet_array.length)];
		tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");
	}

	if (tweet_body.length > 140) {
		tweet_body = tw_company + ' is hiring ' + tw_position + ' 📢 ' + tw_url;
		tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");
	}

	if (tweet_body.length > 140) {
		tweet_body = tw_position  + ' in ' + company_body + ' ' + tw_url;
		tweet_body = tweet_body.replace(/^\s+|\s+$/g, "");
	}

	if (tweet_body.length > 140) {
		tweet_body = 'We have interesting job in ' + company_body + ' ' + tw_url;
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
				if (err) console.log('! TWITTER | ' + err + moment().format());
			});
			if (tags.indexOf('nodejs') >= 0){
				t_nodejs.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! nodejs | ' + err + moment().format());
				});
			}
			if (tags.indexOf('java') >= 0 || tags.indexOf('android') >= 0 || tags.indexOf('groovy') >= 0){
				t_java.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! java | ' + err + moment().format());
				});
			}
			if (tags.indexOf('meteorjs') >= 0){
				t_meteorjs.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! meteorjs | ' + err + moment().format());
				});
			}
			if (tags.indexOf('php') >= 0 || tags.indexOf('cakephp') >= 0 || tags.indexOf('symfony') >= 0){
				t_php.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! php | ' + err + moment().format());
				});
			}
			if (tags.indexOf('android') >= 0){
				t_android.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! android | ' + err + moment().format());
				});
			}
			if (tags.indexOf('net') >= 0 || tags.indexOf('c#') >= 0 || tags.indexOf('asp') >= 0){
				t_dotnet.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! net | ' + err + moment().format());
				});
			}
			if (tags.indexOf('ios') >= 0 || tags.indexOf('swift') >= 0){
				t_ios.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
					if (err) console.log('! IOS | ' + err + moment().format());
				});
			}
		}
	});
}

if (inProduction()){
	var twitter_bot = "#remotework OR #remotelife OR #nomads OR #digitalnomad OR #remotejob OR remote work OR remote jobs OR remote job design OR remote job";
	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			T.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							T.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			T.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					T.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							T.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			t_nodejs.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							t_nodejs.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			t_nodejs.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					t_nodejs.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							t_nodejs.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			t_java.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							t_java.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			t_java.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					t_java.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							t_java.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			t_meteorjs.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							t_meteorjs.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			t_meteorjs.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					t_meteorjs.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							t_meteorjs.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			t_php.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							t_php.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			t_php.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					t_php.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							t_php.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			t_android.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							t_android.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			t_android.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					t_android.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							t_android.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			t_dotnet.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							t_dotnet.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			t_dotnet.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					t_dotnet.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							t_dotnet.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

	SyncedCron.add({
		name: 'BOT_FAVORITE',
		schedule: function(parser) {
			return parser.text('every 10 minutes');
		},
		job: function() {
			t_ios.get('search/tweets', {q: twitter_bot, resulttype: "recent"}, function (err, data,response) {
				if (!err && data.statuses.length > 0) {
					var tweets = data.statuses;
					var randomTweet = randIndex(tweets);
						if(!randomTweet.favorited){
							t_ios.post('favorites/create', {id : randomTweet.id_str},function (err, response) {
								if (err) console.log('Like Error: ', err);
							});
						}
				}
				else { console.log('Like Search Error: ', err);}
			});
		}
	});

	SyncedCron.add({
		name: 'BOT_FRIEND_ADD',
		schedule: function(parser) {
			return parser.text('every 30 minutes');
		},
		job: function() {
			t_ios.get('followers/ids', function(err, reply) {
				if(err) {  console.log('FOLLOW Search Error: ', err);}
				else{
					var followers = reply.ids
					, randFollower  = randIndex(followers);

					t_ios.get('friends/ids', { user_id: randFollower }, function(err, reply) {
						if(err) { console.log('FOLLOW Search 2 Error: ', err); }
						else{
							var friends = reply.ids
							, target  = randIndex(friends);

							t_ios.post('friendships/create', { id: target },  function(err, reply){
								if(err) { console.log('FOLLOW Create Error: ', err); }
							});
						}
					})
				}
			})
		}
	});

}
