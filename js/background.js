var unreadCount = 0;
var FeedLoader = {
	myFeedList : new LocalStore('myFeeds'),
	initialise : function(){
		google.load("feeds", "1");
	},
	setFeedIntervals : function(){
		t=setTimeout("FeedLoader.loadAllFeeds()",5000);  //heres the comment
	},
	loadFeed : function(url,numEntries) {
				//	  console.log("LoadFeed : " + url);
				//	  console.log(url);
				//	  console.log(numEntries);
					  var feed = new google.feeds.Feed(url);
  					  feed.includeHistoricalEntries();
  					  feed.setNumEntries(numEntries);
  					  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
  					  feed.load(function(result) 
					  {
					  	if (!result.error) {
						//console.log(result);
						//var result = pokki.rpc('update_feed('  + JSON.stringify((result.feed)) + ')')
						/*if(feedinfo.headlines == null)
							feedinfo.headlines = new Array(); */
						for(var i = 0;i<result.feed.entries.length;i++)
						{
							//console.log(result.feed.entries[i].link);
							if(!FeedController.isRead(url,result.feed.entries[i].link))
								unreadCount++;
						}
														
						}
  					  });
	},
	loadAllFeeds : function() {
//		console.log("Loading all feeds");
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
		setTimeout("FeedLoader.loadAllFeeds()",5000*12*5);    // Wait for 5 mins before nexr poll
	}
	
};
