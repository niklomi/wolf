let twit_body = function(data,tw_company_full,tw_company,tw_position,tags,id, url) {
  let secretTitterTags = ['digitalnomad', 'remotejobs', 'remotework'];

  function randomTag() {
    let index = Math.floor(secretTitterTags.length * Math.random());
    return secretTitterTags[index];
  }

  let company_body = tw_company_full;
  tw_company = tw_company_full;

  if (data.length > 0 && data[0].screen_name) {
    tw_company = '.@' + data[0].screen_name.toLowerCase();
    company_body = '@' + data[0].screen_name.toLowerCase();
  }

  let tw_tags = '', tw_url = ' remotewolfy.com/job/' + url;

  if (tags && tags.length === 1)
    tags.push(randomTag());
  if (tags) {
    tags.forEach(function(tag) {
      if (tag === 'c#') tag = 'csharp';
      tw_tags += ' #' + tag;
    });
  }

  let tweet_array = [
    tw_company + ' need some cool remote ' + tw_position   + tw_tags +  ' 📢 ' + tw_url ,
    tw_company + ' is looking for remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
    'Want to work like ' + tw_position + ' in ' + company_body + ' ? ' + tw_tags + ' ➡ ' + tw_url,
    tw_company + ' wants to hire remote '  + tw_position   + tw_tags + ' 📣 ' + tw_url ,
    tw_company + ' seeking remote '  + tw_position   + tw_tags + ' 🌍 ' + tw_url ,
    'Want to be remote ' + tw_position + ' in ' + company_body + ' ? ' + tw_tags + ' ➡ ' + tw_url,
    tw_position + ' in ' + company_body + ' Interesting ? ' + tw_tags + ' 📢 ' + tw_url,
    'BOOM! Remote ' + tw_position + ' in ' + company_body  + ' Are you in ? ' + ' 📣 ' + tw_url ,
    'Do you know some cool ' + tw_position + ' who can work in ' + company_body + ' ? ' +  tw_url ,
    ' 🔥🔥🔥 remote ' + tw_position + ' in ' + company_body  + tw_tags + ' / ' + tw_url,
  ];

  let tweet_body = tweet_array[Math.floor(Math.random() * tweet_array.length)]
  tweet_body = tweet_body.replace(/^\s+|\s+$/g, '');

  if (tweet_body.length > 140) {
    tweet_body = tweet_array[Math.floor(Math.random() * tweet_array.length)];
    tweet_body = tweet_body.replace(/^\s+|\s+$/g, '');
  }

  if (tweet_body.length > 140) {
    tweet_body = tw_company + ' is hiring ' + tw_position + ' 📢 ' + tw_url;
    tweet_body = tweet_body.replace(/^\s+|\s+$/g, '');
  }

  if (tweet_body.length > 140) {
    tweet_body = tw_position  + ' in ' + company_body + ' ' + tw_url;
    tweet_body = tweet_body.replace(/^\s+|\s+$/g, '');
  }

  if (tweet_body.length > 140) {
    tweet_body = 'We have interesting job in ' + company_body + ' ' + tw_url;
    tweet_body = tweet_body.replace(/^\s+|\s+$/g, '');
  }

  return tweet_body;
}

tweeet_create = function(company,position,id,tags, url) {
  let tw_company = company.replace(/\s/g,'').replace(/[^A-Za-z\s!?]/g,'');
  let tw_position = position.trim(),
  tw_company_full = company.trim();

  T.get('users/search', { q : tw_company , page :1 , count : 1}, function(err, data, response) {
    let tweet_body = twit_body(data, tw_company_full, tw_company, tw_position, tags, id, url);

    if (inProduction()) {
      T.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
        if (err) console.log('! TWITTER | ' + err + moment().format());
      });
      if (tags.indexOf('nodejs') >= 0) {
        t_nodejs.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
          if (err) console.log('! nodejs | ' + err + moment().format());
        });
      }
      if (tags.indexOf('java') >= 0 || tags.indexOf('android') >= 0 || tags.indexOf('groovy') >= 0) {
        t_java.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
          if (err) console.log('! java | ' + err + moment().format());
        });
      }
      if (tags.indexOf('meteorjs') >= 0) {
        t_meteorjs.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
          if (err) console.log('! meteorjs | ' + err + moment().format());
        });
      }
      if (tags.indexOf('php') >= 0 || tags.indexOf('cakephp') >= 0 || tags.indexOf('symfony') >= 0) {
        t_php.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
          if (err) console.log('! php | ' + err + moment().format());
        });
      }
      if (tags.indexOf('android') >= 0) {
        t_android.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
          if (err) console.log('! android | ' + err + moment().format());
        });
      }
      if (tags.indexOf('net') >= 0 || tags.indexOf('c#') >= 0 || tags.indexOf('asp') >= 0) {
        t_dotnet.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
          if (err) console.log('! net | ' + err + moment().format());
        });
      }
      if (tags.indexOf('ios') >= 0 || tags.indexOf('swift') >= 0) {
        t_ios.post('statuses/update', { status:  tweet_body }, function(err, data, response) {
          if (err) console.log('! IOS | ' + err + moment().format());
        });
      }
    }
  });
}

if (inProduction()) {

  function randIndex (arr) {
    let index = Math.floor(arr.length * Math.random());
    return arr[index];
  }

  let twitterBotWords = 'remote work OR remote jobs';
  SyncedCron.add({
    name: 'BOT_FAVORITE',
    schedule: function(parser) {
      return parser.text('every 10 minutes');
    },
    job: function() {
      T.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses,
          randomTweet = randIndex(tweets);
          T.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              T.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 1'
                  });
                }
              });
            }
          });
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
        else {
          let followers = reply.ids, randFollower = randIndex(followers);

          T.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else {
              let friends = reply.ids, target = randIndex(friends);

              T.post('friendships/create', { id: target },  function(err, reply) {
                if(err) { console.log('FOLLOW Create Error: ', err); }
              });
            }
          });
        }
      });
    }
  });

  SyncedCron.add({
    name: 'BOT_FAVORITE',
    schedule: function(parser) {
      return parser.text('every 10 minutes');
    },
    job: function() {
      t_nodejs.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses;
          let randomTweet = randIndex(tweets);
          t_nodejs.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              t_nodejs.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 2'
                  });
                }
              });
            }
          });
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
          let followers = reply.ids
          , randFollower  = randIndex(followers);

          t_nodejs.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else{
              let friends = reply.ids
              , target  = randIndex(friends);

              t_nodejs.post('friendships/create', { id: target },  function(err, reply) {
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
      t_java.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses;
          let randomTweet = randIndex(tweets);
          t_java.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              t_java.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 3'
                  });
                }
              });
            }
          });
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
          let followers = reply.ids
          , randFollower  = randIndex(followers);

          t_java.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else{
              let friends = reply.ids
              , target  = randIndex(friends);

              t_java.post('friendships/create', { id: target },  function(err, reply) {
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
      t_meteorjs.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses;
          let randomTweet = randIndex(tweets);
          t_meteorjs.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              t_meteorjs.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 4'
                  });
                }
              });
            }
          });
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
          let followers = reply.ids
          , randFollower  = randIndex(followers);

          t_meteorjs.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else{
              let friends = reply.ids
              , target  = randIndex(friends);

              t_meteorjs.post('friendships/create', { id: target },  function(err, reply) {
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
      t_php.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses;
          let randomTweet = randIndex(tweets);
          t_php.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              t_php.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 5'
                  });
                }
              });
            }
          });
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
          let followers = reply.ids
          , randFollower  = randIndex(followers);

          t_php.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else{
              let friends = reply.ids
              , target  = randIndex(friends);

              t_php.post('friendships/create', { id: target },  function(err, reply) {
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
      t_android.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses;
          let randomTweet = randIndex(tweets);
          t_android.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              t_android.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 6'
                  });
                }
              });
            }
          });
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
          let followers = reply.ids
          , randFollower  = randIndex(followers);

          t_android.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else{
              let friends = reply.ids
              , target  = randIndex(friends);

              t_android.post('friendships/create', { id: target },  function(err, reply) {
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
      t_dotnet.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses;
          let randomTweet = randIndex(tweets);
          t_dotnet.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              t_dotnet.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 7'
                  });
                }
              });
            }
          });
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
          let followers = reply.ids
          , randFollower  = randIndex(followers);

          t_dotnet.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else{
              let friends = reply.ids
              , target  = randIndex(friends);

              t_dotnet.post('friendships/create', { id: target },  function(err, reply) {
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
      t_ios.get('search/tweets', {q: twitterBotWords, resulttype: 'recent'}, function(err, data,response) {
        if (!err && data.statuses.length > 0) {
          let tweets = data.statuses;
          let randomTweet = randIndex(tweets);
          t_ios.get('statuses/show', {id : randomTweet.id_str}, function(err, response) {
            if(!response.favorited) {
              t_ios.post('favorites/create', {id : randomTweet.id_str}, function(err, response) {
                if (err) console.log('Like Error: ', err);
                if (err && err.code === 261) {
                  Slack.send({
                    text: 'twiter err 261 - 8'
                  });
                }
              });
            }
          });
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
          let followers = reply.ids
          , randFollower  = randIndex(followers);

          t_ios.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if(err) { console.log('FOLLOW Search 2 Error: ', err); }
            else{
              let friends = reply.ids
              , target  = randIndex(friends);

              t_ios.post('friendships/create', { id: target },  function(err, reply) {
                if(err) { console.log('FOLLOW Create Error: ', err); }
              });
            }
          })
        }
      })
    }
  });

}
