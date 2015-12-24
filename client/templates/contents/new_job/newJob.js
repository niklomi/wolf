Template.new_job.onCreated(function(){
	let data = {
		posotion: "",
		company: "",
		comapny_url:"",
		description:""
	}

	var self = this;
	self.error = new ReactiveVar(data);
});

Template.new_job.onRendered(function(){
	$('#summernote').summernote({
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontsize', ['fontsize']],
			['para', ['ul', 'ol', 'paragraph']],
			['insert',['link']]
		],
		height: 200
	});
})

Template.new_job.helpers({
	error:function(){
		let instance = Template.instance();
		return instance.error.get();
	}
});

Template.new_job.events({
	'submit #job-send': function(e,template){
		e.preventDefault();
		let errors = template.error.get(),
		position = $(e.target).find('[id=f_position]').val(),
		company = $("input[id=f_company]").val();

		if (position.length === 0 || company.length === 0) return false;

		if ($('#summernote').summernote('code').length > 15000) {
			errors.description = "*Description is too big"
			return template.error.set(errors);
		}

		let sanitizeHtml = UniHTML.purify($('#summernote').summernote('code'),{ noFormatting: true }),
		post = {
			position : $(e.target).find('[id=f_position]').val(),
			description : sanitizeHtml,
			company : $("input[id=f_company]").val(),
			company_url : $(e.target).find('[id=f_company_url]').val(),
			highlight : $(e.target).find('[id=f_highlight]:checked').val()
		}
		Meteor.call('valid1', post, function(error, result) {
			if (error){
				errors.global = `*${error}`;
				return template.error.set(errors);
			}
		});
	}
});
