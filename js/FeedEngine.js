// FeedEngine File
var fetchTimer;
var inFetchingState = false;
var FeedEngine = {
	checkFeed : function(url,feedobj,imgsrc){
					 
					  var feed = new google.feeds.Feed(url);
  					  feed.setNumEntries(10);
  					  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
  					  feed.load(function(result) 
					  {
					  	if (!result.error) 
						{	
							clearTimeout(subscriptionTimer);
							var feed_name = FeedController.addFeed(result.feed);
							if(feed_name !=0 )
							{	
								FeedViewer.showSuccessfulSubscription(feed_name,url,feedobj,imgsrc);
								FeedViewer.initialiseMyFeeds();
							}
						}
						else
						{
							$("#searchbox").find('input:text').val("");
							$("#searchbox img").css("opacity","0");
							$("#error-message").html("Sorry, We could not find feeds at this url.").fadeIn().delay(2000).fadeOut(400);
						}
						
  					  });  
	},
	showFeed : function(url){
					  fetchTimer = setTimeout("FeedEngine.showTimeout()",10000);
					  inFetchingState = true;
					  var feed = new google.feeds.Feed(url);
					  feed.includeHistoricalEntries();
  					  feed.setNumEntries(10);
  					  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
  					  feed.load(function(result) 
					  {
						  inFetchingState = false;
					  	if (!result.error) 
						{
							modes.switchToMode(2);
						//	console.log("feed engine showfeed");
							ReaderViewer.renderFeed(result.feed);
						}
						else
						{
						$("#loadingScreen").html("Failed to retrieve Feed.").fadeIn().delay(2000).fadeOut(400);							
						$("#loadingScreen").css('visibility','hidden').css('display','none');
						$("#loadingScreen").html("<img src = 'img/feedsload.gif' />");
						loadingFinished = true;
						}
					  })
	},
	loadHeadlines : function(url,num){
		
		//console.log("Load headlines : " + url + " , "  + num);
		var feed = new google.feeds.Feed(url);
					   feed.includeHistoricalEntries();
  					  feed.setNumEntries(num);
  					  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
  					  feed.load(function(result) 
					  {
					  	if (!result.error) 
						{
						//	console.log("Success");
							console.log(result);
							FeedViewer.registerHeadlines("success",result.feed);
						}
						else
						{
						//	console.log("Failure");
							FeedViewer.registerHeadlines("failure",null);
						}
  					  });
	},
	showTimeout : function()
	{
		if(inFetchingState)
		{
			clearTimeout(fetchTimer);
			$("#loadingScreen").html("<p>Connection Timeout. May be you are not connected to Internet!</p>").fadeIn().delay(2000).fadeOut(400,
				function(){
					$("#loadingScreen").css('visibility','hidden').css('display','none');
			$("#loadingScreen").html("<img src = 'img/feedsload.gif' />");
			});							
			inFetchingState = false;
			loadingFinished = true;
		}
	}
	
};