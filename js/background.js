var FeedLoader = {
	myFeedList : new LocalStore('myFeeds'),
	initialise : function(){
		google.load("feeds", "1");
	},
	setFeedIntervals : function(){
	//	console.log("Setting intervals : " + url);
//		t=setTimeout("FeedLoader.loadFeed(" +"'" +url+"'" + ",10)",5000*12);
		t=setTimeout("FeedLoader.loadAllFeeds()",5000*12);
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
						//var result = pokki.rpc('update_feed('  + JSON.stringify((result.feed)) + ')');
						var feed = new LocalStore(url);
						var feedinfo = JSON.parse(feed.get());
				//		console.log("Feed of " + url + " : "  + feedinfo);
						if(feedinfo.headlines == null)
							feedinfo.headlines = new Array();
						for(var i = 0;i<10;i++)
						{
							feedinfo.headlines[i] = result.feed.entries[i].title;
						}
						feed.set(JSON.stringify(feedinfo));
						}
  					  });
	},
	loadAllFeeds : function() {
//		console.log("Loading all feeds");
		var list = FeedLoader.myFeedList.get();
		if(list!=null)
		{	
			var myFeeds = list.split(",");
			for(var i = 0;i<myFeeds.length;i++)
			{
				FeedLoader.loadFeed(myFeeds[i],10);
			}
		}
		
	}
	
};
