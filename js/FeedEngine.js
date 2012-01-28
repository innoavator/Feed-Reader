// FeedEngine File
var FeedEngine = {
	checkFeed : function(url,feedobj){
					      try{
						  var feed = new google.feeds.Feed(url);
						  }catch(err){
						  	//console.log(err);
							console.log("Returning");
							return;}
						  feed.setNumEntries(10);
						  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
						  feed.load(function(result) 
						  {
						//	if($(feedobj).find('.feedimage').attr('src') != imgsrc)
							{
								if (!result.error) 
								{	
									var feed_name = FeedController.addFeed(result.feed);
									if(feed_name !=0 )
									{	
										FeedViewer.showSuccessfulSubscription(feed_name,url,feedobj);
										FeedViewer.initialiseMyFeeds();
									}
								}
								else
								{
									//FeedEngine.searchFeed(url);
									$("#searchbox").find('input:text').val("");
									$("#searchbox img").css("opacity","0");
									$('#loadingurl').css('opacity',0);
									showMessage("Sorry, We could not find feeds at this url.");
								}
						   	 }
						  
					  }); 
					  
	},
	showFeed : function(url){
					  fetchTimer = setTimeout("FeedEngine.showTimeout()",10000);
					  inFetchingState = true;
					  var feed = new google.feeds.Feed(url);
					  feed.includeHistoricalEntries();
  					  feed.setNumEntries(20);
  					  feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
  					  feed.load(function(result) 
					  {
						  inFetchingState = false;
					  	if (!result.error) 
						{
							modes.switchToMode(2);
						//	console.log("feed engine showfeed");
							ReaderViewer.renderFeed(result.feed,0,20,true);
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
	loadHeadlines : function(url,num,minindex,maxindex){
		
		//console.log("Load headlines : " + url + " , "  + num);
		if(minindex < 0)
			minindex = 0;
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
							console.log("Length of feed : " + result.feed.entries.length);
							if(result.feed.entries.length > minindex)
								ReaderViewer.renderFeed(result.feed,minindex,maxindex,false);
							else
							{
								switchToLoadingView(false);
								$("#hnext").hide();
								//TODO - Show a message - could not retrieve more feeds
							}
						}
						else
						{
						//	console.log("Failure");
						//	ReaderViewer.registerHeadlines("failure",null);
						}
  					  });
	},
	getYoutubeSuggestions : function(query)
	{
		var selectedli = $(".filter .selected");
		if($(selectedli).attr('data-value') == "youtube")
		{
			console.log("Fetching youtube suggestions\n");
			
			jQTubeUtil.suggest(query,function(response){ 
				//return response.suggestions;
				$("#youtubeSuggestions").empty();
				for(var i =0;i<5;i++)
				{
					if(response.suggestions[i]==null)
					break;
					$("#youtubeSuggestions").append("<li>"+response.suggestions[i]+"</li>");
					//console.log(response.suggestions[sug]);
				} 
				$("#youtubeSuggestions").css('display','block');
		}); 
		}
	
	},
	getVideos : function(query)
	{
		$.ajax({
			  method: "get",
			  url: "http://gdata.youtube.com/feeds/api/videos?max-results=12&alt=json&format=1&q="+query,
			  success: function(result){
				FeedViewer.listVideos(result);
		  	  },
			  
			  timeout: (15 * 1000),
			  dataType : "json"	,
			  error: function( objAJAXRequest, strError ){
				$("#youtube-feeds").empty().text("Error! Type: " +strError);
	  			}
			}); 
	},
	
	showVideos: function(query)
	{
			$.ajax({
			  method: "get",
			  url: query,
			  
			  success: function(result){
				FeedViewer.listVideos(result);
		  	  	},
				timeout: (15 * 000),
			  dataType : "json"	,
			  error: function( objAJAXRequest, strError ){
				$(".videoslist").empty().text("Error! Type: " +strError);
	  			}
				
			  });
			  
	},
	
	searchFeed : function(query)
	{
		google.feeds.findFeeds(query,function(result){
		if (!result.error) 
		{
			/*for (var i = 0; i < result.entries.length; i++) 
			{
				
				//var entry = result.entries[i];
				//html += '<p><a href="' + entry.url + '">' + entry.title + '</a></p>';
			}*/
			console.log(result);
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