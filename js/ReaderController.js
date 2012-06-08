var Reader = {

	syncWithGoogle : function()
	{
		window.localStorage.setItem("isSyncOn","true");
		$("#loadercontainer").find("h1").show(0);
		GoogleReader.loginViaOauth(Reader.syncSubscriptions);
	},
	
	syncSubscriptions : function(sublist)
	{
		console.log("Subscriptions received");
		console.log(sublist);
		continueLocal();
	},
	handleSubscriptionList : function(list)
	{
		console.log("Callback successful");
		console.log(list);
	}
}