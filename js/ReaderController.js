var Reader = {
	
	continuationToken : "",
	startindex : 0,
	endindex : 0,
	refetchSent : 0,
	syncWithGoogle : function()
	{
		window.localStorage.setItem("isSyncOn","true");
		showLoaderMessage("Loading...");
		GoogleReader.loginViaOauth(function(response){
			if(response == "OK"){
				addContextMenu();
				//Start background polling for unread count
				pokki.rpc('FeedLoader.updateFromGoogle()');
				Reader.syncSubscriptions();
			}
			});
	},
	
	syncSubscriptions : function()
	{
		if(GoogleReader.hasAuth() != true)
			return;
		$("loadercontainer").find(".button green").css("display","none");
		$("#syncProgressBar").css("display","block");                                                                
		showLoaderMessage("Fetching Google Reader Subscriptions...");
		GoogleReader.getSubscriptionList(function(google_subs){
		showLoaderMessage("Fetching Local Subscriptions...");
		var local_subs = DbManager.getSubscriptionIds(function(){
			/* Callback function for getting subscriptions list from local database*/
			var orig_local_subs = local_subs;
			if(local_subs == null)
				local_subs = new Array();
			else {
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
			while(j< local_subs.length && i<google_subs.length)
			{
				while( (j<local_subs.length) && (i<google_subs.length) && (google_subs[i].id<local_subs[j])){
					//register Google subscripitons in local subscripitons
					console.log("Register in Local : " + google_subs[i].id);
					DbManager.insertSubscription(google_subs[i].id,google_subs[i].htmlUrl,google_subs[i].title,null);
					i++;
					showProgress(incr,true);
				}
				while((j<local_subs.length) && (i<google_subs.length) && (local_subs[j] < google_subs[i].id)){
					//Register local subscriptions in google
					console.log("Register in Google : " + local_subs[j]);
					GoogleReader.subscribe(local_subs[j],"title");
					j++;
					showProgress(incr,true);
				}
				while( j<local_subs.length && i<google_subs.length && local_subs[j]== google_subs[i].id){
						if(orig_local_subs[j] != local_subs[j])
						{
							// Unsubscribe the orig_local_sub
							DbManager.removeSubscription(orig_local_subs[j]);
							//Subscribe the local_sub
							DbManager.insertSubscription(google_subs[i].id,google_subs[i].htmlUrl,google_subs[i].title,null);
						}
						i++;j++;
					showProgress(2*incr,true);
				}
			}
			while(i<google_subs.length)
			{
				DbManager.insertSubscription(google_subs[i].id,google_subs[i].htmlUrl,google_subs[i].title,null);
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
			FeedViewer.renderMyFeeds();
			continueLocal();
			});
		});
	},
	
	subscribe : function(feedinfo)
	{
		/* Subscribe to feed in the Local Database */
		var htmlUrl = null;
		try{
			htmlUrl = feedinfo.alternate[0].href;
		}catch(err){
		}
		DbManager.insertSubscription(feedinfo.id,htmlUrl,feedinfo.title,null);

		/* Subscribe on Google Reader */
		if(GoogleReader.hasAuth() == true)
			GoogleReader.subscribe(feedinfo.id,feedinfo.title,false);
 
	},
	unsubscribe : function(url,callback)
	{
		console.log("Unsubscribe : " + url);

		/* Unsubscribe from the local database */
		DbManager.removeSubscription(url,callback);

		/* Unsubscribe from Google reader */
		if(GoogleReader.hasAuth() == true)
		GoogleReader.unsubscribe(url,function(){
			console.log("Feed Unsubscribed successfully");
			});
	},
	
	editItemTag : function(feedUrl,itemId,tagToAdd,tagToRemove)
	{
		/* Edit the Item Tag locally */
		if(!tagToRemove)
			DbManager.insertItemTag(feedUrl,itemId,tagToAdd);
		else if(tagToRemove != tagToAdd)
			DbManager.updateItemTag(feedUrl,itemId,tagToAdd);
		
		/* Edit the Item Tag on GoogleReader */
		if(GoogleReader.hasAuth() == true)
		{
			if(!tagToRemove)
				GoogleReader.addItemTag(feedUrl,itemId,tagToAdd);
			else if(tagToRemove != tagToAdd)
				GoogleReader.editItemTag(feedUrl,itemId,tagToAdd,tagToRemove);
		}

	},
	
	/*
	markAsRead : function(feedUrl,itemUrl,toRemove,init_tag,final_tag)
	{
				//Only mark on Google, Local data has been deprecated.
		if(GoogleReader.hasAuth() == true)
		{
			if(toRemove)
				GoogleReader.editItemTag(feedUrl,itemUrl,"read","kept-unread");
			else
				GoogleReader.addItemTag(feedUrl,itemUrl,"read");
		}
			
		//FeedController.saveAsRead(feedUrl,itemUrl);
	},
	
	keepUnread : function(feedUrl,itemUrl)
	{
		//Only mark on Google, local data has been deprecated.
		if(GoogleReader.hasAuth() == true)
			GoogleReader.editItemTag(feedUrl,itemUrl,"kept-unread","read");
		//FeedController.removeFromRead(feedUrl,itemUrl); 
	},*/
	
	getFeedContent : function(feedUrl,callback,fallback)
	{
		console.log("Getting feed content");		
		var xt = "";
		if(window.localStorage.getItem("readMode") == SHOWUNREAD)
			xt = "read";	
		GoogleReader.getFeedContent(feedUrl,20,xt,Reader.continuationToken,
				function(result){
					if(callback) callback();
					Reader.continuationToken = result.continuation;
					var previndex = Reader.endindex;
					Reader.endindex+=result.items.length;
					Reader.refetchSent = 0;
					modes.switchToMode(2);
					ReaderViewer.renderGoogleFeed(result,previndex,Reader.endindex,feedUrl);
					console.log("Rendering feed");
				},
				fallback);
	},
	getNextContent : function(feedUrl,slide_no)
	{
		if(((Reader.endindex - slide_no) < 10) && (Reader.refetchSent == 0) && Reader.endindex <90)
		{
			console.log("Time to fetch more feeds");
			DbManager.getUnreadCount(feedUrl,function(unreadCount){
				//Callback for getting the Unread Count for the Database.
				if(!(GoogleReader.hasAuth()) || !(window.localStorage.getItem("readMode") == SHOWUNREAD) || (unreadCount>Reader.endindex))
				{
					console.log("Fetching more feeds");
					Reader.refetchSent = 1;
					$("#headlactions").find('img').show();
					Reader.getFeedContent(feedUrl,function(){
						$("#headlactions").find('img').hide();
					},function(){
						$("#headlactions").find('img').hide();
						$("#headlactions").find("h2").fadeIn().delay(2000).fadeOut("slow");
						Reader.refetchSent = 0;
					});
				}	
			});
		}
	},
	resetState : function()
	{
		this.continuationToken = "";
		this.startindex = 0;
		this.endindex = 0;
		this.refetchSent = 0;
	}
}
