var unreadCount = 0;
var BackgroundWorker = {
	count : 1,
	prevTotalCount : -1,
	initialise : function(){
		DbManager.openDb();
		DbManager.syncWithLocalStorage();
		pokki.addEventListener('context_menu',function(id){
			if(id =="logoutbtn"){
				pokki.rpc('pokki.openPopup()');
				GoogleReader.logout();
				pokki.removeIconBadge();
				pokki.rpc('showLogoutPopup()');
				pokki.resetContextMenu();
			}else if(id == "markallasread") {
				BackgroundWorker.markAllAsRead();
			}
		});
		
		if(window.localStorage.getItem("isSyncOn") && window.localStorage.getItem("isSyncOn")=="true")
		{	
			BackgroundWorker.updateFromGoogle();
		}
		/* Start the process to prune the database. */
		setInterval("DbManager.pruneDatabase()",86400000);

	},
	updateFromGoogle : function()
	{
		var totalCount = 0;
		GoogleReader.getUnreadCount(function(data){
			/* Callback function for getUnreadCount from Google. */
			DbManager.getSubscriptionIds(function(myFeedsList){
				/* Callback function for the getSubscriptionIds from database*/
				for(var i =0;i<data.unreadcounts.length;i++){
				var feed = data.unreadcounts[i];
				if((feed.id).indexOf("feed/") == 0)
				{
					//pokki.rpc('DbManager.updateUnreadCount',(feed.id).substr(5),feed.count);
					DbManager.updateUnreadCount((feed.id).substr(5),feed.count);
					if(myFeedsList != null)
					{
						for(var j=0;j<myFeedsList.length;j++)
							if(myFeedsList[j] == (feed.id).substr(5))
							{
								myFeedsList.splice(j, 1);
								break;
							}
					}
					totalCount+=feed.count;
				}
			}
			var flag = false;
			for(var i =0;myFeedsList!=null && i<myFeedsList.length;i++){
				DbManager.updateUnreadCount(myFeedsList[i],0);
				flag = true;
			}
			if(totalCount != BackgroundWorker.prevTotalCount || flag)
			{
				pokki.rpc('FeedViewer.updateFeedCount()');
				BackgroundWorker.prevTotalCount = totalCount;
			}
			if(totalCount > 0 && totalCount<1000)
				pokki.setIconBadge(totalCount);
			else if(totalCount > 1000)
				pokki.setIconBadge(999);
			else
				pokki.removeIconBadge();
			if(GoogleReader.hasAuth() == true)
				setTimeout("BackgroundWorker.updateFromGoogle()",5000*3);
			});
						
		});
		
	},
	markAllAsRead : function(){
		var replyCount = 0;
		DbManager.getSubscriptionIds(function(list){
			if(list){
				for(var i=0;i<list.length;i++)
					GoogleReader.markAllAsRead(list[i],function(){
						DbManager.updateUnreadCount(list[i],0);
						replyCount++;
						if(replyCount >=(list.length-1))
							pokki.rpc('FeedViewer.updateFeedCount()');
					});
			}									  
		});
	},

};
