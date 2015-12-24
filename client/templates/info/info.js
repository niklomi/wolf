Template.info.onRendered(function(){
	if (FlowRouter.current().context.pathname.indexOf("contact") > 0)
		document.getElementById("contact").scrollIntoView();
	let parts = ["wolfy", "remote", 64, "il.com", "gma"];
	document.getElementById("secr").textContent = parts[1] + parts[0] + String.fromCharCode(parts[2]) + parts[4] + parts[3];
});
