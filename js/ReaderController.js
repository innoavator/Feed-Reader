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
		var local_subs = FeedController.getMyFeeds();
		var orig_local_subs = local_subs;
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
			
			while( (j<local_subs.length) && (i<google_subs.length) && (google_subs[i].id<local_subs[j])){
				//register Google subscripitons in local subscripitons
				console.log("Register in Local : " + google_subs[i].id);
				FeedController.addFeed({
									    id:google_subs[i].id,
										link:google_subs[i].htmlUrl,
										title:google_subs[i].title
										});
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
						FeedController.removeFeed(orig_local_subs[j]);
						//Subscribe the local_sub
						FeedController.addFeed({
							id:google_subs[i].id,
							link:google_subs[i].htmlUrl,
							title:google_subs[i].title
							});
					}
					i++;j++;
				showProgress(2*incr,true);
			}
		}
		while(i<google_subs.length)
		{
			FeedController.addFeed({
									    id:google_subs[i].id,
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
	
	subscribe : function(feedinfo)
	{
		/* Subscribe to Feed Locally */
		FeedController.addFeed(feedinfo);
	
		/* Subscribe on Google Reader */
		if(GoogleReader.hasAuth() == true)
			GoogleReader.subscribe(feedinfo.id,feedinfo.title,false);
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
	},
	
	markAsRead : function(feedUrl,itemUrl,toRemove)
	{
		//Only mark on Google, Local data has been deprecated.
		if(GoogleReader.hasAuth() == true)
		if(toRemove)
			GoogleReader.editItemTag(feedUrl,itemUrl,"read","kept-unread");
		else
			GoogleReader.addItemTag(feedUrl,itemUrl,"read");
		/*FeedController.saveAsRead(feedUrl,itemUrl);*/
	},
	
	keepUnread : function(feedUrl,itemUrl)
	{
		//Only mark on Google, local data has been deprecated.
		if(GoogleReader.hasAuth() == true)
			GoogleReader.editItemTag(feedUrl,itemUrl,"kept-unread","read");
		/*FeedController.removeFromRead(feedUrl,itemUrl); */
	},
	
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
	  
	  /*
		  fetchTimer = setTimeout("FeedEngine.showTimeout()",10000);
		  inFetchingState = true;
		  var feed = new google.feeds.Feed(url);
		  feed.includeHistoricalEntries();
		  feed.setNumEntries(20);
		  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
		  feed.load(function(result) 
		  {
			  inFetchingState = false;
				if (!result.error) 
				{
					modes.switchToMode(2);
				//	console.log("feed engine showfeed");
					console.log(result.feed);
					ReaderViewer.renderFeed(result.feed,0,20,true);
				}
				else
				{
				$("#loadingScreen").html("Failed to retrieve Feed.").fadeIn().delay(2000).fadeOut(400);							
				$("#loadingScreen").css('visibility','hidden').css('display','none');
				$("#loadingScreen").html("<img src = 'img/feedsload.gif' />");
				loadingFinished = true;
				}
		  })*/
	},
	getNextContent : function(feedUrl,slide_no)
	{
		if(((Reader.endindex - slide_no) < 10) && (Reader.refetchSent == 0) && Reader.endindex <90)
		{
			console.log("Time to fetch more feeds");
			var unreadCount = FeedController.getUnreadCount(feedUrl);
			if(!(GoogleReader.hasAuth()) || !(window.localStorage.getItem("readMode") == SHOWUNREAD) || (unreadCount>Reader.endindex))
			{
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