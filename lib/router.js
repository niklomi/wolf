String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

Meteor.startup(function() {
  if (Meteor.isClient) {
    return SEO.config({
      title: 'Remote Wolfy',
      meta: {
        'description': 'The fastest and easiest way to find a great 100% remote tech job and work remote in best companies and startups like Uber, Twitter and other..'
      },
    });
  }
});

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading');
}

OneAfter = RouteController.extend({
});

UserC = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'list_jobs' : {to: 'table'}
  },
  fastRender: true
});

if (Meteor.isClient){
  Session.setDefault('countofshow',75);
}

AllPostsController = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    return Meteor.subscribe('allPosts', count);
  },
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
            title: 'Remote Wolfy | Digital and Tech Remote Jobs',
            meta: {
              'description': 'The fastest, easiest way to find a great 100% remote Job in top companies like Apple, Uber, Twitter and other'
            },
            og: {
              'title': 'Remote Wolfy | Digital and Tech Remote Jobs',
              'description': 'The fastest, easiest way to find a great 100% remote Tech Job in top companies: Apple, Uber, Twitter and more',
              'local': 'en_US',
              'type': 'website'
            }
          });
  },
  fastRender: true
});

RodC = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  fastRender: true
})

TrendC = RodC.extend({
	waitOn: function() {
    	var count = 75;
    	if(Meteor.isClient) {
    		count = Session.get('countofshow')
    	}
    	return Meteor.subscribe('navigation', 'trends' ,count);
  	},
  data: {selector: {category: { $in: ['trends']}}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Trends in Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Remote Job trends that includes modern technologies and popular companies like Twitter, Uber and other'
        },
        og: {
          'title': 'Trends in Remote Jobs | Remote Wolfy',
          'description': 'Remote Job trends that includes modern technologies and popular companies like Twitter, Uber and other'
        }
      });
    }
});

MobileC = RodC.extend({
	waitOn: function() {
    	var count = 75;
    	if(Meteor.isClient) {
    		count = Session.get('countofshow')
    	}
    	return Meteor.subscribe('navigation', 'mobile' ,count);
  	},
  data: {selector: {category: { $in: ['mobile']}}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'IOS Android Developer Jobs | Remote Wolfy',
        meta: {
          'description': 'Find the best remote jobs in the mobile industry: IOS, Android Developer and more'
        },
        og: {
          'title': 'IOS Android Developer Jobs | Remote Wolfy',
          'description': 'Find the best remote jobs in the mobile industry: IOS, Android Developer and more'
        }
      });
    }
});

EnterpriseC = RodC.extend({
	waitOn: function() {
    	var count = 75;
    	if(Meteor.isClient) {
    		count = Session.get('countofshow')
    	}
    	return Meteor.subscribe('navigation', 'enterprise' ,count);
  	},
  data: {selector: {category: { $in: ['enterprise']}}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'IT Enterprise Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to find remote jobs in IT enterprise sphere at companies like GitHub, Google, Apple and others'
        },
        og: {
          'title': 'IT Enterprise Jobs | Remote Wolfy',
          'description': 'Click here to find remote jobs in IT enterprise sphere at companies like GitHub, Google, Apple and others'
        }
      });
    }
});

DesignC = RodC.extend({
	waitOn: function() {
    	var count = 75;
    	if(Meteor.isClient) {
    		count = Session.get('countofshow')
    	}
    	return Meteor.subscribe('navigation', 'designer' ,count);
  	},
  data: {selector: {category: { $in: ['designer']}}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Design & Designer Jobs | Remote Wolfy',
        meta: {
          'description': 'Looking for Remote Design jobs? Remote Wolfy has the latest Remote jobs in Design. '
        },
        og: {
          'title': 'Design & Designer Jobs | Remote Wolfy',
          'description': 'Looking for Remote Design jobs? Remote Wolfy has the latest Remote jobs in Design. '
        }
      });
    }
});

WebdevC = RodC.extend({
	waitOn: function() {
    	var count = 75;
    	if(Meteor.isClient) {
    		count = Session.get('countofshow')
    	}
    	return Meteor.subscribe('navigation', 'webdev' ,count);
  	},
  data: {selector: {category: { $in: ['webdev']}}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Web Developer Jobs | Remote Wolfy',
        meta: {
          'description': 'Search for Remote Web Developer jobs in IT enterprise sphere at companies like GitHub, Google, Apple and others'
        },
        og: {
          'title': 'Web Developer Jobs | Remote Wolfy',
          'description': 'Search for Remote Web Developer jobs in IT enterprise sphere at companies like GitHub, Google, Apple and others'
        }
      });
    }
});

FullstackC = RodC.extend({
	waitOn: function() {
    	var count = 75;
    	if(Meteor.isClient) {
    		count = Session.get('countofshow')
    	}
    	return Meteor.subscribe('navigation', 'fullstack' ,count);
  	},
  data: {selector: {category: { $in: ['fullstack']}}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Full Stack Engineer Jobs | Remote Wolfy',
        meta: {
          'description': 'Work with Top companies: Periscope, Meerkat and other, as a Full Stack engineer. View and apply to these listings or browse for similar jobs.'
        },
        og: {
          'title': 'Full Stack Engineer Jobs | Remote Wolfy',
          'description': 'Work with Top companies: Periscope, Meerkat and other, as a Full Stack engineer. View and apply to these listings or browse for similar jobs.'
        }
      });
    }
});

GithubPostController = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    return Meteor.subscribe('source',"github", count);
  },
  data: {selector: {source: "github"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'GitHub Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to view all remote jobs from Github.com on RemoteWolfy.com'
        },
        og: {
          'title': 'GitHub Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote jobs from Github.com on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});
WWRPostController = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    return Meteor.subscribe('source',"wwr", count);
  },
  data: {selector: {source: "wwr"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'WWR Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to view all remote jobs from WWR on RemoteWolfy.com'
        },
        og: {
          'title': 'WWR Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote jobs from WWR on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});
WFHPostController = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    return Meteor.subscribe('source',"wfh", count);
  },
  data: {selector: {source: "wfh"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'WFH Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to view all remote jobs from WFH on RemoteWolfy.com'
        },
        og: {
          'title': 'WFH Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote jobs from WFH on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});
WWMPostController = RouteController.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    count = 1;
    return Meteor.subscribe('source',"wwm", count);
  },
  data: {selector: {source: "wwm"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'MeteorJS Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to view all remote MeteorJS jobs on RemoteWolfy.com'
        },
        og: {
          'title': 'MeteorJS Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote MeteorJS jobs on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});
DribbblePostController = RouteController.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    count = 1;
    return Meteor.subscribe('source',"dribbble", count);
  },
  data: {selector: {source: "dribbble"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Dribbble Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to view all remote jobs from Dribbble on RemoteWolfy.com'
        },
        og: {
          'title': 'Dribbble Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote jobs from Dribbble on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});
BehancePostController = RouteController.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    count = 1;
    return Meteor.subscribe('source',"behance", count);
  },
  data: {selector: {source: "behance"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Behance Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to view all remote jobs from Behance on RemoteWolfy.com'
        },
        og: {
          'title': 'Behance Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote jobs from Behance on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});
StackPostController = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    return Meteor.subscribe('source',"stack", count);
  },
  data: {selector: {source: "stack"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'StackOverflow Remote Jobs | Remote Wolfy' ,
        meta: {
          'description': 'Click here to view all remote jobs from StackOverflow on RemoteWolfy.com'
        },
        og: {
          'title': 'StackOverflow Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote jobs from StackOverflow on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});
AuthenticPostController = OneAfter.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    return Meteor.subscribe('source',"auth", count);
  },
  data: {selector: {source: "auth"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Authentic Remote Jobs | Remote Wolfy',
        meta: {
          'description': 'Click here to view all remote jobs from Authentic on RemoteWolfy.com'
        },
        og: {
          'title': 'Authentic Remote Jobs | Remote Wolfy',
          'description': 'Click here to view all remote jobs from Authentic on RemoteWolfy.com'
        }
      });
    },
    fastRender: true
});

WolfyC = RouteController.extend({
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    count = 1;
    return Meteor.subscribe('source',"WOLFY", count);
  },
  data: {selector: {source: "WOLFY"}},
  onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Remote Wolfy | Digital and Tech Remote Jobs',
        meta: {
          'description': 'Show all remote jobs from Remote Wolfy'
        },
        og: {
          'title': 'Remote Wolfy | Digital and Tech Remote Jobs',
          'description': 'Remote Wolfy help you to find a great remote job from Wolfy in minutes'
        }
      });
    },
    fastRender: true
});

TagJobController = RouteController.extend({
  waitOn: function() {
    var count = 150;
    if(Meteor.isClient) {
      count = Session.get('countofshow')
    }
    count = 1;
    return Meteor.subscribe('tags', this.params.tag,count);
  },
  layoutTemplate: 'mainPage',
  yieldTemplates: {
    'timeTable' : {to: 'table'}
  },
  data: function(){
    var index = {selector : {tag: this.params.tag} }
    if ( index ) { return index };
  },
  onBeforeAction: function(){
    var instance = EasySearch.getComponentInstance(
      { index: 'posts' }
    );
    instance.clear();
    this.next();
  },
  onAfterAction: function() {
      var tag;
      if (!Meteor.isClient) {
        return;
      }
      tag = this.params.tag;
      SEO.set({
        title: tag.capitalize() + " Remote Jobs | Remote Wolfy",
        meta: {
          'description': "View all " + tag.capitalize() + " remote jobs in top companies like AirBNB, Twitter and other"
        },
        og: {
          'title': tag.capitalize() + " Remote Jobs | Remote Wolfy",
          'description': "View all " + tag.capitalize() + " remote jobs in top companies like AirBNB, Twitter and other"
        }
      });
    },
    fastRender: true
});

ExistJobPostController = OneAfter.extend({
  template: 'existJob',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data:function() {
    var post;
    post = Posts.findOne(this.params._id);
    if ( post ) { return post };
  },
  onAfterAction: function() {
    $('html, body').scrollTop(0);
    if (!Meteor.isClient) {
        return;
    }
    var post = Posts.findOne(this.params._id), title, description, company = post.company.replace(/^\s+|\s+$/g, ""),
    post_length = Posts.find({ position : post.position, company : post.company }).fetch().length;

    title = post.position + ' at ' + company + ' ' + moment(post.createdAt).format('YYYY-MM-DD');
    description = company.capitalize() + ' is looking for '  + post.position + ' ' + moment(post.createdAt).format('YYYY-MM-DD') + ' | Remote Wolfy';

    SEO.set({
      title: title ,
      meta: {
        'description': description
      },
      og: {
        'url': Router.current().path,
        'title': title,
        'description': description
      }
    });
  },
  fastRender: true
});

NewJobPostController = OneAfter.extend({
  template: 'newJob',
  onAfterAction: function() {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) this.render('notFound');
    if (!Meteor.isClient) {
        return;
    }
  },
    fastRender: true
});


Router.map(function() {
  this.route('timeTable', {path: '/',
      controller: AllPostsController
  });
  this.route('userc', {
      path: '/jobs/NLerm4sbtzq6MjyZm',
      controller: UserC,
  });
  this.route('githubPosts', {
    path: '/github',
    controller: GithubPostController,
  });
  this.route('wwrPosts', {
    path: '/wwr',
    controller: WWRPostController,
  });
  this.route('wfhPosts', {
    path: '/wfh',
    controller: WFHPostController,
  });
  this.route('wwmPosts', {
    path: '/wwm',
    controller: WWMPostController,
  });
  this.route('dribbblePosts', {
    path: '/dribbble',
    controller: DribbblePostController,
  });
  this.route('behancePosts', {
    path: '/behance',
    controller: BehancePostController,
  });
  this.route('stackPosts', {
    path: '/stackoverflow',
    controller: StackPostController,
  });
  this.route('authenticPosts', {
    path: '/authentic',
    controller: AuthenticPostController,
  });
  this.route('WOLFY', {
    path: '/wolfy',
    controller: WolfyC,
  });
  this.route('existJob', {
    path: '/job/:_id',
    controller: ExistJobPostController,
  });
  this.route('tagJob', {
    path: '/tags/:tag',
    controller: TagJobController,
  });
  this.route('newJob', {
    path: '/post-job',
    controller: NewJobPostController,
  });
  this.route('trends', {
    path: '/trends',
    controller: TrendC,
  });
  this.route('mobile', {
    path: '/mobile',
    controller: MobileC,
  });
  this.route('enterprise', {
    path: '/enterprise',
    controller: EnterpriseC,
  });
  this.route('design', {
    path: '/design',
    controller: DesignC,
  });
  this.route('webdev', {
    path: '/web-development',
    controller: WebdevC,
  });
  this.route('fullstack', {
    path: '/fullstack',
    controller: FullstackC,
  });
});



if (Meteor.isClient) {
  Router.onBeforeAction('dataNotFound');
}
