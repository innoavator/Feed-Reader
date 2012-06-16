// FeedEngine File
var FeedEngine = {
	
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
			console.log(result);
		}
	});
	},
	
};