var Reader = {
	
	syncWithGoogle : function()
	{
		window.localStorage.setItem("isSyncOn","true");
		$("#loadercontainer").find("h3").show(0);
		GoogleReader.loginViaOauth(Reader.syncSubscriptions);
	},
	
	syncSubscriptions : function()
	{
		GoogleReader.getSubscriptionList(function(google_subs){
		var local_subs = FeedController.getMyFeeds();
		for(var sub in local_subs)
			sub = sub.split("?")[0];
		local_subs.sort();
		console.log(local_subs);
		google_subs = google_subs.subscriptions;
		for(var i=0;i<google_subs.length;i++)
			google_subs[i].id = (google_subs[i].id).substr(5);
		(google_subs).sort(function(a,b){return (a.id < b.id) ? -1 : 1;});
		var flag = false,i=0,j=0;
		console.log(google_subs);
		while(i< local_subs.length && j<google_subs.length){
			
			while((google_subs[i].id<local_subs[j]) && i<google_subs.length){
				//register Google subscripitons in local subscripitons
				console.log("Register in Local : " + google_subs[i].id);
				var feedinfo = new Object();
				feedinfo.feedUrl = google_subs[i].id;
				feedinfo.link = google_subs[i].htmlUrl;
				feedinfo.title = google_subs[i].title;
				FeedController.addFeed(feedinfo);
				i++;
			}
			while((local_subs[j] < google_subs[i].id) && j<local_subs.length){
				//Register local subscriptions in google
				console.log("Register in Google : " + local_subs[j]);
				GoogleReader.subscribe(local_subs[j],"title");
				j++;
			}
			while(local_subs[j]== google_subs[i].id && j<local_subs.length && google_subs.length){
				i++;j++;
			}
		}
		});
	},
	handleSubscriptionList : function(list)
	{
		console.log("Callback successful");
		console.log(list);
	}
}