var unreadCount = 0;
var FeedLoader = {
	myFeedList : new LocalStore('myFeeds'),
	initialise : function(){
		google.load("feeds", "1");
	},
	setFeedIntervals : function(){
	//	console.log("Setting intervals : " + url);
//		t=setTimeout("FeedLoader.loadFeed(" +"'" +url+"'" + ",10)",5000*12);
		t=setTimeout("FeedLoader.loadAllFeeds()",5000);  //heres the comment
		//FeedLoader.loadAllFeeds();
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
							console.log(unreadCount);
							pokki.setIconBadge(unreadCount);							
						}
  					  });
	},
	loadAllFeeds : function() {
//		console.log("Loading all feeds");
		unreadCount = 0;
		var list = FeedLoader.myFeedList.get();
		if(list!=null && list!="")
		{	
			var myFeeds = list.split(",");
			console.log(myFeeds.length);
			for(var i = 0;i<myFeeds.length;i++)
			{
				console.log(myFeeds[i]);
				FeedLoader.loadFeed(myFeeds[i],20);
			}
		}
		else
		{
			pokki.removeIconBadge();
			console.log("Setting to 0");
			
		}
		setTimeout("FeedLoader.loadAllFeeds()",5000);
	}
	
};
