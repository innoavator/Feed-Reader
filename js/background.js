var unreadCount = 0;
var FeedLoader = {
	myFeedList : new LocalStore('myFeeds'),
	count : 1,
	initialise : function(){
		pokki.addEventListener('context_menu',function(id){
				if(id =="logoutbtn"){
					window.localStorage.setItem("isSyncOn","false");
					window.localStorage.setItem("access_token","");
					window.localStorage.setItem("refresh_token","");
				}
			});
			if(window.localStorage.getItem("isSyncOn") && window.localStorage.getItem("isSyncOn")=="true")
			{	
				console.log("Updating from google");
				FeedLoader.updateFromGoogle();
			}
			else
			{
				console.log("Updating from local");
				google.load("feeds", "1",{"callback" : FeedLoader.loadAllFeeds});
				FeedLoader.updateUnreadCount();
			}
	},
	loadFeed : function(url,numEntries) {
					  var counter = 0;//FeedController.getUnreadCount();;
					  console.log("Counter from local Storage : " + counter);
					  var feed = new google.feeds.Feed(url);
  					  feed.includeHistoricalEntries();
  					  feed.setNumEntries(numEntries);
  					  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
  					  feed.load(function(result) 
					  {
					  	if (!result.error) {
							for(var i = 0;i<result.feed.entries.length;i++)
							{
								//console.log(result.feed.entries[i].link);
								if(!FeedController.isRead(url,result.feed.entries[i].link))
									counter++;
							}
							unreadCount+=counter;
							var feedStore = new LocalStore(url);
							var feedinfo = JSON.parse(feedStore.get());
							feedinfo.unreadCount = counter;
							feedStore.set(JSON.stringify(feedinfo));
							/*var countObj = new Object();
							countObj.count = counter;
							countObj.url = url;
							console.log("Updating feed Count");
						    pokki.rpc('FeedViewer.updateFeedCount('+JSON.stringify(countObj)+')');
							*/
						}
  					  });
	},
	loadAllFeeds : function() {
		console.log("Loading all feeds");
		unreadCount = 0;
		var list = FeedLoader.myFeedList.get();
		if(list!=null && list!="")
		{	
			var myFeeds = list.split(",");
			for(var i = 0;i<myFeeds.length;i++)
			{
				FeedLoader.loadFeed(myFeeds[i],20);
			}
		}
		if(GoogleReader.hasAuth == false)
		setTimeout("FeedLoader.loadAllFeeds()",5000*12*5);
	},
	updateUnreadCount : function()
	{
		var totalCount = 0 ;
		var countObj = new Object();
		var list = FeedController.getMyFeeds();
		if(list!=null)
		{
			for(var i =0;i<list.length;i++)
			{
				countObj.count = FeedController.getUnreadCount(list[i]);
				countObj.url = list[i];
				pokki.rpc('FeedViewer.updateFeedCount('+JSON.stringify(countObj)+')');
				totalCount+=countObj.count;
			}
			if(totalCount > 0)
				pokki.setIconBadge(totalCount);
			else
				pokki.removeIconBadge();
		}
		if(GoogleReader.hasAuth == false)
		setTimeout("FeedLoader.updateUnreadCount()",5000*12);
		
	},
	
	updateFromGoogle : function()
	{
		console.log("Updating from Google..");
		var totalCount = 0;
		GoogleReader.getUnreadCount(function(data){
			console.log(data.unreadcounts.length);
			for(var i =0;i<data.unreadcounts.length;i++){
				var feed = data.unreadcounts[i];
				if((feed.id).indexOf("feed/") == 0)
				{
					var feedStore = new LocalStore((feed.id).substr(5));
					var feedinfo = JSON.parse(feedStore.get());
					if(feedinfo){
						feedinfo.unreadCount = feed.count;
						feedStore.set(JSON.stringify(feedinfo));
						totalCount+=feed.count;
					}
					console.log("Count : "+feed.count + " , Total Count :" + totalCount);
				}
			}
			console.log("Total : " + totalCount);
			if(totalCount > 0 && totalCount<1000)
				pokki.setIconBadge(totalCount);
			else if(totalCount > 1000)
				pokki.setIconBadge(999);
			else
				pokki.removeIconBadge();
			if(GoogleReader.hasAuth() == true)
				setTimeout("FeedLoader.updateFromGoogle()",5000*3);
			
		});
		
	}
	
};
