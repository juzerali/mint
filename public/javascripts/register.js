$(function(){
	console.log("Document is ready");
	now.ready(function(){
		console.log("Now is ready");
		$('input').removeAttr("disabled");

		$('#register').submit(function(e){
			e.preventDefault();
			now.sendVerificationMail($('#email').val());
		});

		now.successfullySent = function(response){
			$('input').hide;
			$('form').text("Check Your email for further instructions"+" "+response);
		};

		now.error = function(err){
			alert("not sent: "+JSON.stringify(err));
		};
	});

});