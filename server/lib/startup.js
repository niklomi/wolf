Cheerio = Meteor.npmRequire('cheerio');
Future = Meteor.npmRequire('fibers/future');
xml2js = Meteor.npmRequire('xml2js');
urlapi = Meteor.npmRequire('url');
Twit = Meteor.npmRequire('twit');
request = Meteor.npmRequire('request');
SlackAPI = Meteor.npmRequire( 'node-slack' );
htmlToText = Meteor.npmRequire('html-to-text');
Slack = new SlackAPI( Meteor.settings.private.slack.hook );


  T = new Twit({
  consumer_key: Meteor.settings.private.twitter.consumer_key,
  consumer_secret: Meteor.settings.private.twitter.consumer_key_secret,
  access_token: Meteor.settings.private.twitter.access_token,
  access_token_secret: Meteor.settings.private.twitter.access_token_secret
});

  t_nodejs = new Twit({
  consumer_key: Meteor.settings.private.t_nodejs.consumer_key,
  consumer_secret: Meteor.settings.private.t_nodejs.consumer_key_secret,
  access_token: Meteor.settings.private.t_nodejs.access_token,
  access_token_secret: Meteor.settings.private.t_nodejs.access_token_secret
});

  t_java = new Twit({
  consumer_key: Meteor.settings.private.t_java.consumer_key,
  consumer_secret: Meteor.settings.private.t_java.consumer_key_secret,
  access_token: Meteor.settings.private.t_java.access_token,
  access_token_secret: Meteor.settings.private.t_java.access_token_secret
});

  t_meteorjs = new Twit({
  consumer_key: Meteor.settings.private.t_meteorjs.consumer_key,
  consumer_secret: Meteor.settings.private.t_meteorjs.consumer_key_secret,
  access_token: Meteor.settings.private.t_meteorjs.access_token,
  access_token_secret: Meteor.settings.private.t_meteorjs.access_token_secret
});

  t_php = new Twit({
  consumer_key: Meteor.settings.private.t_php.consumer_key,
  consumer_secret: Meteor.settings.private.t_php.consumer_key_secret,
  access_token: Meteor.settings.private.t_php.access_token,
  access_token_secret: Meteor.settings.private.t_php.access_token_secret
});

  t_android = new Twit({
  consumer_key: Meteor.settings.private.t_android.consumer_key,
  consumer_secret: Meteor.settings.private.t_android.consumer_key_secret,
  access_token: Meteor.settings.private.t_android.access_token,
  access_token_secret: Meteor.settings.private.t_android.access_token_secret
});

  t_dotnet = new Twit({
  consumer_key: Meteor.settings.private.t_dotnet.consumer_key,
  consumer_secret: Meteor.settings.private.t_dotnet.consumer_key_secret,
  access_token: Meteor.settings.private.t_dotnet.access_token,
  access_token_secret: Meteor.settings.private.t_dotnet.access_token_secret
});

  t_ios = new Twit({
  consumer_key: Meteor.settings.private.t_ios.consumer_key,
  consumer_secret: Meteor.settings.private.t_ios.consumer_key_secret,
  access_token: Meteor.settings.private.t_ios.access_token,
  access_token_secret: Meteor.settings.private.t_ios.access_token_secret
});
