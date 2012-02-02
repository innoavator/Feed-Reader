var FeedController = {
	
	myFeedList : new LocalStore('myFeeds'),
	initialise : function()
	{
		FeedController.myFeedList = new LocalStore('myFeeds');
	},
	addFeed : function(feedinfo)
	{
		var feed_name;
		var url = feedinfo.feedUrl;
		var list = FeedController.myFeedList.get();
		if( list == null || list =="")
		{
			feed_name = FeedController.registerFeed(feedinfo);
			list = url;
		}
		else
		{
			if(list.indexOf(url) == -1)
			{
				feed_name = FeedController.registerFeed(feedinfo);
				list+= "," + url;
			}
			else
			{
				return 0;
			}
		}
		FeedController.myFeedList.set(list);
		return feed_name;
		
	},
	removeFeed : function(url)
	{
		FeedController.unregisterFeed(url);
		var list = FeedController.myFeedList.get();
		if(list!=null)
		{
			list = list.split(",");
			for(i=0;i<list.length;i++)
			{
				if(list[i] == url){
					list.splice(i,1);
					break;
				}
			}
			FeedController.myFeedList.set(list.toString());
		}
		return true;
	},
	listFeeds : function()
	{
		return (FeedController.myFeedList.get());
	},
	getMyFeeds : function()
	{
		var list = FeedController.myFeedList.get();
		if(list!=null)
			return list.split(",");
		else 
			return null;
	},
	clearMyFeedsList : function()
	{
		FeedController.myFeedList.remove();
	},
	issubscribed : function(url)
	{
		var list = FeedController.myFeedList.get();
		if(list!=null)
		{
			list = list.split(",");
			for(i=0;i<list.length;i++)
			{
				if(list[i] == url){
					return 1;
				}
			}
		}
		return 0;
	},
	registerFeed : function(feedinfo)
	{
		var feed = new LocalStore(feedinfo.feedUrl);
		var feedobj = new Object();
		feedobj.link = feedinfo.link;
		feedobj.title = feedinfo.title;
		feedobj.unreadCount = 20;
		feedobj.headlines = new Array();
		for(var i = 0;i<feedinfo.entries.length;i++)
		{
			feedobj.headlines[i] = feedinfo.entries[i].title;
		}
		feed.set(JSON.stringify(feedobj));
		return feedobj.title;
	},
	unregisterFeed : function(url)
	{
		var feed = new LocalStore(url);
		feed.remove();;
	},
	getHeadlines : function(url,num)
	{
		var feed = new LocalStore(url);
		var feedinfo = JSON.parse(feed.get());
		if (feedinfo == null)
		return;
		if(feedinfo.headlines == null)
			return "No Headlines";
		else
		{
			feedstr = "<ul class = 'headl'>";
			for(var i = 0;i<num;i++)
			{
				feedstr+= "<li>"+feedinfo.headlines[i] + "</li>";
			}
			feedstr += "</ul>";
		}
		return feedstr;
	},
	getFeedNames : function()
	{
		var list = FeedController.myFeedList.get();
		var namesList = new Array();
		if(list!=null)
		{
			var feed,feedinfo;
			list = list.split(",");
			for(i=0;i<list.length;i++)
			{
				feed = new LocalStore(list[i]);
				feedinfo = JSON.parse(feed.get());
				namesList[i] = feedinfo.title;
			}
		}
		return namesList;
		
	},
	saveAsRead : function(feedSourceUrl,feedUrl)
	{
		console.log("Save as read request");
		var feed = new LocalStore(feedSourceUrl);
		var feedinfo = JSON.parse(feed.get());
		//console.log(feedinfo);
		var readList = feedinfo.readFeeds;
		if(readList == null)
		{
			readList = feedUrl;
			console.log("Successfully added to  null");
			if(feedinfo.unreadCount>0)
			feedinfo.unreadCount--;
		}else
		{
			if(readList.indexOf(feedUrl) == -1)
			{
				readList+= "," + feedUrl;
				if(feedinfo.unreadCount>0)
					feedinfo.unreadCount--;
				console.log("Successfully added");
			}
		}
		feedinfo.readFeeds = readList;
		feed.set(JSON.stringify(feedinfo));
	},
	removeFromRead : function(feedSourceUrl,feedUrl)
	{
		var feed = new LocalStore(feedSourceUrl);
		var feedinfo = JSON.parse(feed.get());
		var readList = feedinfo.readFeeds;
		if(readList!=null)
		{
			readList = readList.split(",");
			for(i=0;i<readList.length;i++)
			{
				if(readList[i] == feedUrl){
					readList.splice(i,1);
					feedinfo.unreadCount++;
					break;
				}
			}
			feedinfo.readFeeds = readList.toString();
		}
		feed.set(JSON.stringify(feedinfo));
	},
	isRead : function(feedSourceUrl,feedUrl)
	{
		var feed = new LocalStore(feedSourceUrl);
		var feedinfo = JSON.parse(feed.get());
		var readList = feedinfo.readFeeds;
		if(readList == null)
		return false;
		if(readList.indexOf(feedUrl) == -1)
			return false;
		return true;
	},
	setUnreadCount : function(feedUrl,count)
	{
		var feed = new LocalStore(feedUrl);
		var feedinfo = JSON.parse(feed.get());
		console.log(feedinfo);
		if(feedinfo.unreadCount == null)
			console.log("Unread Count is null");
		else
		feedinfo.unreadCount = count;
		feed.set(JSON.stringify(feedinfo));
	},
	getUnreadCount : function(feedUrl)
	{
		var feed = new LocalStore(feedUrl);
		var feedinfo = JSON.parse(feed.get());
		return feedinfo.unreadCount;
	}
}

