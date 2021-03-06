Template.post_job_full.onCreated(function(){
  let self = this;
  self.error_title = new ReactiveVar('');
  self.error_desc = new ReactiveVar('');
  self.error_global = new ReactiveVar('');
  self.good_global = new ReactiveVar('');
});

Template.post_job_full.onRendered(function(){
  const parts = ['wolfy', 'remote', 64, 'il.com', 'gma'];
  document.getElementById('secr').textContent = parts[1] + parts[0] + String.fromCharCode(parts[2]) + parts[4] + parts[3];
});

Template.post_job_full.helpers({
  error_title:() => Template.instance().error_title.get(),
  error_desc:() => Template.instance().error_desc.get(),
  error_global:() => Template.instance().error_global.get(),
  good_global:() => Template.instance().good_global.get()
});

Template.post_job_full.events({
  'submit #job-send':function(e,template){
    e.preventDefault();
    let title = e.target.post_title.value.trim(),
    desc = e.target.post_desc.value.trim(),
    apply = e.target.apply.value.trim();

    if (title.length < 1 || desc.length < 1 || apply.length < 1) return false;
    if (title.length < 5) template.error_title.set('*Title is too short');
    else if (desc.length < 5) {
      template.error_title.set('');
      template.error_desc.set('*Link is too short');
    }
    else{
      template.error_desc.set('');
      $( '#pop-submit-job' ).attr('disabled', 'disabled').button('refresh');
      var data = {title, desc, apply};
      Meteor.call('submitUserJob', data, function(err,res){
        if (err) {
          template.error_global.set(`${err.reason}`)
          $( '#pop-submit-job' ).removeAttr('disabled').button('refresh');
          $( '#pop-submit-job' ).prop('disabled', false);
        }
        else {
          template.good_global.set(`Job has been sent successfully`);
          $( '#pop-submit-job' ).removeAttr('disabled').button('refresh');
          $('#post_title').val('');
          $('#post_desc').val('');
          $('#apply').val('');
        }
      });
    }
  }
});
