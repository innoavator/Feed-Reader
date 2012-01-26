var unreadCount = 0;
var FeedLoader = {
	myFeedList : new LocalStore('myFeeds'),
	initialise : function(){
		google.load("feeds", "1",{"callback" : FeedLoader.loadAllFeeds});
	},
	loadFeed : function(url,numEntries) {
					  var counter = 0;
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
							var countObj = new Object();
							countObj.count = counter;
							countObj.url = url;
							console.log("Updating feed Count");
						    pokki.rpc('FeedViewer.updateFeedCount('+JSON.stringify(countObj)+')');								
						}
  					  });
	},
	loadAllFeeds : function() {
		console.log("Loading all feeds");
		if(unreadCount > 0)
        	pokki.setIconBadge(unreadCount);
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
		else
			pokki.removeIconBadge();
		setTimeout("FeedLoader.loadAllFeeds()",5000*12);    // Wait for 5 mins before nexr poll
	}
	
};
