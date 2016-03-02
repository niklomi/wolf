Meteor.startup(() => {
  SyncedCron.start();
  sitemap();
  __generateTags();
  __createRssFeed();
});

if ( Meteor.users.find().count() === 0 ) {
  let newUser = Accounts.createUser({
    username: Meteor.settings.private.admin.username,
    password: Meteor.settings.private.admin.password,
  });
  Roles.addUsersToRoles(newUser, ['admin']);
}
Accounts.config({
  forbidClientAccountCreation: true,
});

Meteor.methods({
  suggestJobs(_id) {
    check(_id, String);
    let tags = Posts.findOne(_id).tags;
    return Posts.find({ '_id': { $ne: _id }, 'tags': { $in: tags}}, {fields: {image: 1, position: 1, company: 1}, skip: 1, limit: 5}).fetch();
  },
  adminSubmitJob(post) {
    if (this.userId && Roles.userIsInRole(this.userId, ['admin'])) {
      if (typeof post.highlight === 'undefined') post.highlight = '';
      check(post, Object);
      check(post, {
        position: String,
        description: String,
        company: String,
        company_url: String,
        highlight: String,
        apply_url: String
      });
      post.description = UniHTML.purify(post.description, { noFormatting: true });

      if (post.company_url === '') delete post.company_url;
      let tags = __makeTAG(post.position, [], post.description);
      let category = __makeCATEGORY(post.position, post.description);
      job = ({
        image: 'WOLFY',
        tags: tags,
        status: true,
        source: 'WOLFY',
        category: category
      });
      let newpost = _.extend(post, job );

      let postId = Posts.insert(newpost);
      tweeet_create(post.company, post.position, postId, post.tag);
    }
  },
  send_job(data) {
    check(data, {
      title: String,
      desc: String,
      apply: String
    });
    if (data.title.length > 100 || data.desc.length > 200 || data.apply.length > 200) {
      throw new Meteor.Error( 'Error: ', 'There was an error processing your request' );
    }
    let job = {
      test: true,
      status: false,
      position: data.title,
      description: data.desc,
      apply_url: data.apply
    };
    Posts.insert(job);
    Slack.send({
      text: 'New job!',
      username: 'Andy Warhol',
      icon_url: 'https://tmc-post-content.s3.amazonaws.com/warhol-icon/warhol-icon.png',
      attachments: [{
        fallback: 'New job!',
        color: 'good',
        fields: [
        { title: 'Title', value: data.title },
        { title: 'Description url', value: data.desc },
        { title: 'Apply ', value: data.apply }
        ]
      }]
    });
  }
});
