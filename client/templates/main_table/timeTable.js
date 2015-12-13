Template.timeTable.onRendered(function(){
	Meteor.call('ser_time',function(e,r){
		Session.set('t_time', r.t);
		Session.set('y_time', r.y);
		Session.set('w_time', r.w);
		Session.set('m_time', r.m);
	});
});

Template.timeTable.onCreated(function(){
	Session.set('loading',false);
	setInterval(function () {
		Meteor.call('ser_time',function(e,r){
			Session.set('t_time', r.t);
			Session.set('y_time', r.y);
			Session.set('w_time', r.w);
			Session.set('m_time', r.m);
		});
	}, 60000);
});

Template.timeTable.events({
	'click #loadmore' : function(){
		Session.set('countofshow', Session.get('countofshow') + 150);
	}
});

Template.timeTable.helpers({
	load:function(){
		if (Session.get('loading')) return true;
	},
	morepostexist: function(){
		if(Posts.find().count() % Session.get('countofshow') === 0 && Posts.find().count() > 0)
		return true;
	},
	todaydate: function(){
		return moment().format('MMMM D').toUpperCase();
	},
	today: function() {
		var today = Session.get('t_time'),yesterday = Session.get('y_time');
		var selector = _.clone(this.selector || {});
		selector.createdAt = {$gte: yesterday, $lte: today};
		return Posts.find(selector,{ sort: { createdAt: -1 }});
	},
	week: function() {
		var yesterday = Session.get('y_time');
		var weekstart = Session.get('w_time');
		var selector = _.clone(this.selector || {});
		selector.createdAt = {$gte: weekstart, $lt: yesterday};
		return Posts.find(selector,{ sort: { createdAt: -1 }});
	},
	month: function() {
		var weekstart = Session.get('w_time');
		var monthstart = Session.get('m_time');
		var selector = _.clone(this.selector || {});
		selector.createdAt = {$gte: monthstart, $lte: weekstart};
		return Posts.find(selector,{ sort: { createdAt: -1 }});
	},
	posts_exist_today: function(){
		var today = Session.get('t_time');
		var yesterday = Session.get('y_time');
		var selector = _.clone(this.selector || {});
		if(!(Posts.findOne({$and: [selector,{createdAt: {$gte: yesterday, $lte: today}}]})))
			return false;
		else return true;
	},
	posts_exist_week: function(){
		var yesterday = Session.get('y_time');
		var weekstart = Session.get('w_time');
		var selector = _.clone(this.selector || {});
		if(!(Posts.findOne({$and: [selector,{createdAt: {$gte: weekstart, $lt: yesterday}}]})))
			return false;
		else return true;
	},
	posts_exist_month: function(){
		var weekstart = Session.get('w_time');
		var monthstart = Session.get('m_time');
		var selector = _.clone(this.selector || {});
		if(!(Posts.findOne({$and: [selector, {createdAt: {$gte: monthstart, $lte: weekstart}}]})))
			return false;
		else return true;
	},
	not_exist:function(){
		var selector = _.clone(this.selector || {});
		if(!(Posts.findOne(selector))) return true;
		else return false;
	}
});
