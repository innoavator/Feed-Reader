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
		},
	updateFromGoogle : function()
	{
		console.log("Updating from Google..");
		var totalCount = 0;
		GoogleReader.getUnreadCount(function(data){
			var myFeedsList = FeedController.getMyFeeds();
			for(var i =0;i<data.unreadcounts.length;i++){
				var feed = data.unreadcounts[i];
				if((feed.id).indexOf("feed/") == 0)
				{
					console.log(feed.id + " : " + feed.count);
					FeedController.setUnreadCount((feed.id).substr(5),feed.count);
					for(var j=0;j<myFeedsList.length;j++)
						if(myFeedsList[j] == (feed.id).substr(5))
						{
							myFeedsList.splice(j, 1);
							break;
						}
					totalCount+=feed.count;
				}
			}
			for(var i =0;i<myFeedsList.length;i++)
			{
				FeedController.setUnreadCount(myFeedsList[i],0);
			}
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
