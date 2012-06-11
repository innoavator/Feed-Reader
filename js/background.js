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
		this.startPolling();	
		 
	},
	startPolling : function()
	{
		if(window.localStorage.getItem("isSyncOn") && window.localStorage.getItem("isSyncOn")==true)
		{	
			console.log("Updating from google");
			FeedLoader.updateFromGoogle();
		}
		else
		{
				google.load("feeds", "1",{"callback" : FeedLoader.loadAllFeeds});
				if(FeedLoader.count == 1)
					FeedLoader.updateUnreadCount();
				else
					FeedLoader.count =2;
		}
		setTimeout("FeedLoader.startPolling()",5000*12*5);
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
		setTimeout("FeedLoader.updateUnreadCount()",5000*2);
	},
	
	updateFromGoogle : function()
	{
		console.log("Updating from Google..");
		var totalCount = 0;
		GoogleReader.getUnreadCount(function(data){
			for(var feed in data.unreadcounts){
				if((feed.id).indexOf("feed/") == 0)
				{
					var feedStore = new LocalStore((feed.id).substr(5));
					var feedinfo = JSON.parse(feedStore.get());
					feedinfo.unreadCount = feed.count;
					feedStore.set(JSON.stringify(feedinfo));
					totalCount+=feed.count;
					console.log("Count :" + feed.count);
				}
			if(totalCount > 0)
				pokki.setIconBadge(totalCount);
			else
				pokki.removeIconBadge();

			}
		});
	}
	
};
