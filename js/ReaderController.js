var Reader = {
	
	syncWithGoogle : function()
	{
		window.localStorage.setItem("isSyncOn","true");
		showLoaderMessage("Loading...");
		GoogleReader.loginViaOauth(function(response){
			if(response == "OK"){
				addLogoutMenu();
				Reader.syncSubscriptions();
			}
			});
	},
	
	syncSubscriptions : function()
	{
		$("#syncProgressBar").css("display","block");                                                                
		showLoaderMessage("Fetching Google Reader Subscriptions...");
		GoogleReader.getSubscriptionList(function(google_subs){
		showLoaderMessage("Fetching Local Subscriptions...");
		var local_subs = FeedController.getMyFeeds();
		if(local_subs == null)
			local_subs = new Array();
		else
		{
			for(var sub in local_subs)
				sub = sub.split("?")[0];
			local_subs.sort();
		}
		console.log(local_subs);
		google_subs = google_subs.subscriptions;
		if(google_subs.length != 0)
		{
			for(var i=0;i<google_subs.length;i++)
				google_subs[i].id = (google_subs[i].id).substr(5);
			//if(google_subs[i].id.charAt(google_subs[i].id.length - 1) == "/")
				//google_subs[i].id = (google_subs[i].id).substring(0,(google_subs[i].id).length -1);
			(google_subs).sort(function(a,b){return (a.id < b.id) ? -1 : 1;});
		}
		var flag = false,i=0,j=0;
		console.log(google_subs);
		showLoaderMessage("Syncing...");
		var incr = 100/(local_subs.length + google_subs.length);
		console.log("Increment : " + incr);
		while(j< local_subs.length && i<google_subs.length){
			
			while( i<google_subs.length && (google_subs[i].id<local_subs[j])){
				//register Google subscripitons in local subscripitons
				console.log("Register in Local : " + google_subs[i].id);
				FeedController.addFeed({
									    feedUrl:google_subs[i].id,
										link:google_subs[i].htmlUrl,
										title:google_subs[i].title
										});
				i++;
				showProgress(incr,true);
			}
			while(j<local_subs.length && (local_subs[j] < google_subs[i].id)){
				//Register local subscriptions in google
				console.log("Register in Google : " + local_subs[j]);
				GoogleReader.subscribe(local_subs[j],"title");
				j++;
				showProgress(incr,true);
			}
			while( j<local_subs.length && i<google_subs.length && local_subs[j]== google_subs[i].id){
				i++;j++;
				showProgress(2*incr,true);
			}
		}
		while(i<google_subs.length)
		{
			FeedController.addFeed({
									    feedUrl:google_subs[i].id,
										link:google_subs[i].htmlUrl,
										title:google_subs[i].title
										});
			i++;
			showProgress(incr,true);
		}
		while(j<local_subs.length)
		{
			console.log("Register in Google : " + local_subs[j]);
			GoogleReader.subscribe(local_subs[j],"title");
			j++;
			showProgress(incr,true);
		}
		continueLocal();
		});
	},
	
	subscribe : function(feedinfo,feedobj)
	{
		//Subscribe to Feed Locally
		console.log(feedinfo);
		var feed_name = FeedController.addFeed(feedinfo);
		console.log("Feed_Name : " + feed_name);
		if(feed_name !=0 ){	
			FeedViewer.showSuccessfulSubscription(feed_name,feedinfo.feedUrl,feedobj);
			FeedViewer.initialiseMyFeeds();
		}
		//Subscribe on Google Reader
		if(GoogleReader.hasAuth() == true)
			GoogleReader.subscribe(feedinfo.feedUrl,feedinfo.title,false,function(){
			console.log("Google reader subscription successful");
		});
	},
	unsubscribe : function(url,callback)
	{
		console.log("Unsubscribe : " + url);
		//Unsubscribe to feed locally
		if(FeedController.removeFeed(url))
			callback();
		
		//Unsubscribe from Google reader
		if(GoogleReader.hasAuth() == true)
		GoogleReader.unsubscribe(url,function(){
			console.log("Feed Unsubscribed successfully");
			});
	}
	
}