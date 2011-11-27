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
		$("#headlview").bind('click',function(){

			$("#rdrheadl").slideToggle();
			$("#minimizeHeadlines").live('click',function(){
			  
			  $("#rdrheadl").slideUp();
				$("#headlview").attr('state','notshown');
			  });
		});
	// Add event handler to next button
		$("#hnext").live('click',function(){
			switchToLoadingView(true);
			$("#hprev").show(0);
			FeedEngine.loadHeadlines($("#feedurldiv").html(), $("#rdrheadl").attr('start')+20)
		});
		$("#hprev").live('click',function(){
			switchToLoadingView(true);							  
			if(temp_feed.length < ($("#rdrheadl").attr('start') - 10))
				FeedEngine.loadHeadlines($("#feedurldiv").html(), $("#rdrheadl").attr('start'));
			else
				FeedViewer.renderHeadlines( $("#rdrheadl").attr('start')-10);
	   });
		$("#rdrheadl li").live('click',function(){
			FeedViewer.renderOneFeed($(this).attr('slideno'));	
		$("#headlactions a").live('click',function(){
			FeedViewer.loadAllFeeds( $("#rdrheadl").attr('start'));
			
			});
		});
	},
	renderFeed : function(feeds){
		
		temp_feed = feeds;
		$("#slider").empty();
		$("#rdrheadl").empty();
		
		var content = feeds.entries;
		var length = 0;
		for(var i = 0;i<content.length;i++)
			length+= content[i].content.length;
		if(length/10 >200)
			ReaderViewer.renderSliderFeed(feeds);
		else
			ReaderViewer.renderScrollFeed(feeds);
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
	renderSliderFeed : function(feeds){
		
		$("#feedurldiv").html(feeds.feedUrl);
		$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');
		var feedContent = feeds.entries;
		for(i= 0;i<feedContent.length;i++)
		{
			var lielement = $('<li>').attr('class','panel' + (i+1));
			var headlineli = $('<li>').attr('slideno',i).attr('link',temp_feed.entries[i].link);
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
			ReaderViewer.initialise();
			$(".textSlide a").addClass("nivoZoom center");
			$("#rdrheadl").append(headlineli);
		}
		$("#rdrheadl").append('<li id = "headlactions"><div id="hprev"></div>'
							 +' <img src = "img/barload.gif"/>'//+'<a href = "#">View All</a>'
							 + '<div id="hnext"></div></li>');
		$("#hprev").hide();
		$("#headlactions").find('img').hide();
		ReaderViewer.initialiseHeadlineView();
	}

}