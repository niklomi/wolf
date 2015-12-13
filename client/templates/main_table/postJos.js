Template.postJob.events({
	'click #showform':function(){
		$('.overlay-body').show();
		$('.overlay').show();
	},
	'click .overlay':function(){
		$('.overlay').hide();
		$('.overlay-body').hide();
	},
	'submit #job-send':function(e){
		e.preventDefault();
		var title = e.target.post_title.value;
		var desc = e.target.post_desc.value;
		var apply = e.target.post_apply.value;
		if (title.length < 5) Bert.alert('Title too short!','warning', 'growl-top-right');
		else if (desc.length < 5) Bert.alert('Description url too short!','warning', 'growl-top-right');
		else{
			$( '#pop-submit-job' ).attr("disabled", "disabled").button('refresh');
			Session.set('loading_overlay',true);
			$( '#pop-submit-job' ).text( "Send " );
			var data = {
				title: title,
				desc: desc,
				apply: apply
			}
			Meteor.call('send_job',data,function(err,res){
				if (err) {
					Bert.alert(err,'danger', 'growl-top-right');
					Session.set('loading_overlay',false);
					$( '#pop-submit-job' ).removeAttr("disabled").button('refresh');
					$( '#pop-submit-job' ).text( "Submit Job NOW" );
					$( '#pop-submit-job' ).prop("disabled", false);
				}
				else {
					Session.set('loading_overlay',false);
					$( '#pop-submit-job' ).text( "Sent " );
					Session.set('good_overlay',true);
					$("#post_title").val('');
					$("#post_desc").val('');
					$("#post_apply").val('');
					Meteor.setTimeout(function(){
						$( '#pop-submit-job' ).removeAttr("disabled").button('refresh');
						$( '#pop-submit-job' ).text( "Submit Job NOW" );
						Session.set('good_overlay',false);
						$('.overlay').hide();
						$('.overlay-body').hide();
					}, 3000);
				}
			});
		}
	}
});

Template.postJob.helpers({
	loading:function(){
		if (Session.get('loading_overlay')) return Session.get('loading_overlay');
	},
	good:function(){
		if (Session.get('good_overlay')) return Session.get('good_overlay');
	}
});
