Template.newJob.rendered = function() {
  var parts = ["wolfy", "remote", 64, "il.com", "gma"];
  document.getElementById("secr").textContent = parts[1] + parts[0] + String.fromCharCode(parts[2]) + parts[4] + parts[3];

   $('#summernote').summernote({
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['fontsize', ['fontsize']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert',['link']]
      ],
      height: 200,
   });
   $('#jobForm').parsley({trigger: 'change'});
 };

 Template.newJob.events({

    'submit form': function(e){
        e.preventDefault();
        if ($('#summernote').code().length < 30) return Bert.alert( "<h4>Hey, you forgot to fill description!</h4>", "danger",'growl-top-right' );
        if (($('#summernote').code().length > 15000) ) return Bert.alert( "<h4>Try to reduce the description, is too big!</h4>", "danger",'growl-top-right' );
        var sanitizeHtml = UniHTML.purify($('#summernote').code());
        var post = {
          position : $(e.target).find('[id=f_position]').val(),
          fullContent : sanitizeHtml,
          company : $("input[id=f_company]").val(),
          companyUrl : $(e.target).find('[id=f_company_url]').val(),
          highlight : $(e.target).find('[id=f_highlight]:checked').val()
        }
        Meteor.call('valid1', post, function(error, result) {         
       	    if (error)        
       	    	return Bert.alert(error.reason, "danger" ,'growl-top-right' );  
             Router.go('timeTable');  
    	});
    }
});