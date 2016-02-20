__createRssFeed = function(){
  RssFeed.publish( 'jobs', function() {
    let feed = this;
    let posts = Posts.find( { status: true }, {fields: {position: 1, description: 1, createdAt: 1, image: 1}} );

    feed.setValue('title', feed.cdata('Remote Jobs'));
    feed.setValue('description', feed.cdata('Live RSS feed wih Tech Remote Jobs'));
    feed.setValue('link', `${Meteor.absoluteUrl()}`);
    feed.setValue('lastBuildDate', new Date());
    feed.setValue('pubDate', new Date());
    feed.setValue('ttl', 1);

    posts.forEach( function( post ) {
      feed.addItem({
        title: post.position.replace(/&/g,"&amp;"),
        description: htmlToText.fromString(post.description).substr(0, 250).replace(/&/g,"&amp;") + '...',
        link: `${Meteor.absoluteUrl()}job/${post._id}`,
        category: 'Remote Jobs',
        pubDate: moment(post.createdAt).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
      });
    });
  });
};
