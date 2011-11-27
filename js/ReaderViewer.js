// JavaScript Document

var ReaderViewer = {
	
	initialise : function(){
		
			$('#slider').anythingSlider({
				resizeContents      : true, 
				navigationSize      : false,
				 buildNavigation     : false,
				 buildStartStop      : false,
				 toggleArrows        : true, 
				 infiniteSlides      : false,
				onSlideComplete: function(slider) {
				}
			
		}); 
	},
	initialiseHeadlineView : function()
	{
		//Click event handler for view Headlines button
		$("#headlview").live('click',function(){ $("#rdrheadl").slideToggle();});
		
		// Click event for minimise button
		$("#minimizeHeadlines").live('click',function(){ $("#rdrheadl").slideUp();});
	    
		// Click event for nextHeadlines button
		$("#hnext").live('click',function(){
			switchToLoadingView(true);
			$("#hprev").show(0);
			var startindex = parseInt($("#rdrheadl").attr('startindex'));
			var endindex = parseInt($("#rdrheadl").attr('endindex'));
			console.log(" Temp feed length : " + temp_feed.entries.length);
			if(temp_feed.entries.length < startindex + 19)
			{
				console.log("Loading headlines");
				FeedEngine.loadHeadlines($("#feedurldiv").html(), endindex+20,endindex,endindex+10);
			}
			else
			{
				console.log("Rendering feed");
				ReaderViewer.renderFeed(temp_feed,endindex,endindex+10);
			}
		});
		
		//Click event for prev headlines button
		$("#hprev").live('click',function(){
			switchToLoadingView(true);
			var startindex = parseInt($("#rdrheadl").attr('startindex'));
			var endindex = parseInt($("#rdrheadl").attr('endindex'));
			if(temp_feed.entries.length < startindex - 10)
				FeedEngine.loadHeadlines($("#feedurldiv").html(),startindex,startindex-10,startindex);
			else
				ReaderViewer.renderFeed(temp_feed,startindex-10,startindex);
	    });
		
		//Click on headlines event
		$("#rdrheadl li").live('click',function(){
			var slideno = $(this).attr('slideno') %10 + 1;
			//FeedViewer.renderOneFeed($(this).attr('slideno'));
			$('#slider').anythingSlider(slideno);
			});
		
		$("#headlactions a").live('click',function(){FeedViewer.loadAllFeeds( $("#rdrheadl").attr('start'));});
	},
	renderFeed : function(feeds,minindex,maxindex){
		
		temp_feed = feeds;
		$("#slider").empty();
		$("#rdrheadl").empty();
		if(minindex == 0)
			$("#rdrheadl").slideUp(0);
		var content = feeds.entries;
		var length = 0;
		for(var i = 0;i<content.length;i++)
			length+= content[i].content.length;
//		if(length/10 >200)
			ReaderViewer.renderSliderFeed(temp_feed,minindex,maxindex);
//		else
//			ReaderViewer.renderScrollFeed(feeds);
		$("#headlactions").find('img').hide();
		loadingFinished = true;
		$("#loadingScreen").css('visibility','hidden').css('display','none');
	},
	renderScrollFeed : function(feeds){
		
		$("#slider").css('width','600px');
		var feedContent = feeds.entries;
		for(i= 0;i<feedContent.length;i++)
		{
			var lielement = $('<li>');
		//	var headlineli = $('<li>').attr('slideno',i).attr('link',temp_feed.entries[i].link);
		//	var wrapdiv = $('<div>');
		//	var divelement = $('<div>').attr('class','textSlide');
			var title = "<a href = '" + feedContent[i].link + "'><h3>" + feedContent[i].title + "</h3></a>";
		//	$(headlineli).html("<h2>"+feedContent[i].title+"</h2>");
			if(feedContent[i].author != null)
				title+= "<h5 style='float:left'>"+feedContent[i].author+"</h5><br>";
			
			var description = "<p>" + feedContent[i].content + "</p>";
			if(feedContent[i].publishedDate != null)
			{
				var date = "<h5 style='float:right;margin-top:3px;clear:both'>" + feedContent[i].publishedDate+"</h5>";
				$(lielement).append(date);
			}
			$(lielement).append(title);
			$(lielement).append(description);
	//		$(wrapdiv).append(divelement);
			$("#slider").append(lielement);
	//		ReaderViewer.initialise();
	//		$(".textSlide a").addClass("nivoZoom center");
	//		$("#rdrheadl").append(headlineli);
		}
	},
	renderSliderFeed : function(feeds,minindex,maxindex){
		
		$("#feedurldiv").html(feeds.feedUrl);
		$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');
		$("#rdrheadl").attr('startindex',minindex);
		$("#rdrheadl").attr('endindex',maxindex);
		var feedContent = feeds.entries;
		for(i= minindex;i<maxindex;i++)
		{
			var lielement = $('<li>').attr('class','panel' + (i+1));
			var headlineli = $('<li>').attr('slideno',i).attr('link',feeds.entries[i].link);
			var wrapdiv = $('<div>');
			var divelement = $('<div>').attr('class','textSlide');
			var title = "<a href = '" + feedContent[i].link + "'><h2>" + feedContent[i].title + "</h2></a>";
			$(headlineli).html("<h2>"+feedContent[i].title+"</h2>");
			if(feedContent[i].author != null)
				title+= "<h5 style='float:left'>"+feedContent[i].author+"</h5><br>";
			
			var description = "<p>" + feedContent[i].content + "</p>";
			if(feedContent[i].publishedDate != null)
			{
				var date = "<h5 style='float:right;margin-top:3px;clear:both'>" + feedContent[i].publishedDate+"</h5>";
				$(divelement).append(date);
			}
			$(divelement).append(title);
			$(divelement).append(description);
			$(wrapdiv).append(divelement);
			$(lielement).append(wrapdiv);
			$("#slider").append(lielement);
			$("#slider").anythingSlider();
			$(".textSlide a").addClass("nivoZoom center");
			$("#rdrheadl").append(headlineli);
		}
		$("#rdrheadl").append('<li id = "headlactions"><div id="hprev"></div>'
							 +' <img src = "img/barload.gif"/>'//+'<a href = "#">View All</a>'
							 + '<div id="hnext"></div></li>');
		if(minindex == 0)
			$("#hprev").hide();
		
//		ReaderViewer.initialiseHeadlineView();
	},
	registerHeadlines : function(result,feeds)
	{
		temp_feed = feeds;
		var start_index = parseInt($("#rdrheadl").attr('startindex'));
		//ReaderViewer.renderHeadlines( start_index + 10);
		ReaderViewer.renderFeed(temp_feed,start_index+10,start_index+0);
	},
	
	renderHeadlines : function(startentry)
	{
		var isMoreFeed = true;
		$("#rdrheadl").empty();
		$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');
		var start = parseInt(startentry,10);

		if(temp_feed)
		{
			if(temp_feed.entries.length > start)
			{
		//		console.log(temp_feed.entries);
				for(var i =start;i<start+10;i++)
				{
					if(temp_feed.entries[i] == null)
						break;
					var headlineli = $('<li>').attr('slideno',i).attr('link',temp_feed.entries[i].link);
					$(headlineli).html("<h2>" + temp_feed.entries[i].title + "</h2>");
					$("#rdrheadl").append(headlineli);
				}
			}
			else
			{
				isMoreFeed = false;
				$("#rdrheadl").append('<li><h2>Could not retrieve more feeds</h2></li>');
			}
		}
		else
		{
			$("#rdrheadl").append('<li><h2>Failed to retrieve feeds</h2></li>');
		}
		$("#rdrheadl").append('<li id = "headlactions"><div id="hprev"></div>'
							 +' <img src = "img/barload.gif"/>'//+<a href = "#">View All</a>'
            				 + '<div id="hnext"></div></li>');
		$("#rdrheadl").attr('start',start);
		if(isMoreFeed)
		{
			if(start == 0)
				$("#hprev").hide();
		}
		else
			$("#hnext").hide();
		switchToLoadingView(false);
	}

}