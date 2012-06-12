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
					if(parseInt($("#rdrheadl").attr('startindex')) == 0)
					{
						Reader.markAsRead($("#feedurldiv").html(),$(".activePage div").find('a').first().attr('href'));
						$("#readMessage").fadeIn(10);
					}
				},
				onSlideInit: function(slider) {
					if(parseInt($("#rdrheadl").attr('startindex')) == 0)
					{
						$("#unreadMessage").fadeOut("slow");
						$("#readMessage").fadeOut("slow");
					}
				}
			});
			if(window.localStorage.getItem("readMode") == null)
				window.localStorage.setItem("readMode",SHOWUNREAD);
			else
				$("#viewOptionsBox").val(window.localStorage.getItem("readMode"));	
			$("#viewOptionsBox").change(function(){
				console.log("Option changed");
				window.localStorage.setItem("readMode",$(this).val());
				$("#loadingScreen").css('visibility','visible').css('display','block');
					Reader.getFeedContent($("#feedurldiv").html());
				});
			$("#readMessage").find('img').click(function(){
				Reader.keepUnread($("#feedurldiv").html(),$(".activePage div").find('a').first().attr('href'));
				$("#readMessage").fadeOut("fast",function(){
				$("#unreadMessage").fadeIn("fast");
				});
			});
			$("#unreadMessage").find('img').click(function(){
				FeedController.saveAsRead($("#feedurldiv").html(),$(".activePage div").find('a').first().attr('href'));
				$("#unreadMessage").fadeOut("fast",function(){
				$("#readMessage").fadeIn("fast");
				});
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
			var startindex = parseInt($("#rdrheadl").attr('startindex'));
			var endindex = parseInt($("#rdrheadl").attr('endindex'));
			console.log(" Temp feed length : " + temp_feed.entries.length);
			if(temp_feed.entries.length < endindex + 19)
			{
				console.log("Loading headlines");
				FeedEngine.loadHeadlines($("#feedurldiv").html(),endindex+NO_OF_FEEDS,endindex,endindex+NO_OF_FEEDS);
			}
			else
			{
				console.log("Rendering feed");
				ReaderViewer.renderFeed(temp_feed,endindex,endindex+NO_OF_FEEDS,false);
			}
		});
		
		//Click event for prev headlines button
		$("#hprev").live('click',function(){
			switchToLoadingView(true);
			var startindex = parseInt($("#rdrheadl").attr('startindex'));
			var endindex = parseInt($("#rdrheadl").attr('endindex'));
			if(temp_feed.entries.length < startindex - NO_OF_FEEDS)
				FeedEngine.loadHeadlines($("#feedurldiv").html(),startindex,startindex-NO_OF_FEEDS,startindex);
			else
				ReaderViewer.renderFeed(temp_feed,startindex-NO_OF_FEEDS,startindex,false);
	    });
		
		//Click on headlines event
		$("#rdrheadl li").live('click',function(){
			var slideno = $(this).attr('slideno') %NO_OF_FEEDS + 1;
			$('#slider').anythingSlider(slideno);
			});
		
	//	$("#headlactions a").live('click',function(){FeedViewer.loadAllFeeds( $("#rdrheadl").attr('startindex'));});
	},
	renderFeed : function(feeds,minindex,maxindex,isFirstTime){
		
		temp_feed = feeds;
		$("#slider").empty();
		$("#rdrheadl").empty();
		var content = feeds.entries;
		$("#viewOptionsBox option").attr("selected","");
		if(window.localStorage.getItem("readMode") == SHOWALL)
			$("#viewOptionsBox").val("1");
		else
			$("#viewOptionsBox").val("0");
		var length = 0;
/*		for(var i = 0;i<content.length;i++)
			length+= content[i].content.length; */
//		if(length/10 >200)
			ReaderViewer.renderSliderFeed(temp_feed,minindex,maxindex,isFirstTime);
//		else
//			ReaderViewer.renderScrollFeed(feeds);
		switchToLoadingView(false);
		loadingFinished = true;
		$("#loadingScreen").css('visibility','hidden').css('display','none');

	},
	renderScrollFeed : function(feeds){
		
		$("#slider").css('width','600px');
		var feedContent = feeds.entries;
		for(i= 0;i<feedContent.length;i++)
		{
			var lielement = $('<li>');
			var title = "<a href = '" + feedContent[i].link + "'><h3>" + feedContent[i].title + "</h3></a>";
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
			$("#slider").append(lielement);
		}
	},
	
/*	renderSliderFeed : function(feeds,minindex,maxindex,isFirstTime){
		
		$("#feedurldiv").html(feeds.feedUrl);
		$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');
		$("#rdrheadl").attr('startindex',minindex);
		$("#rdrheadl").attr('endindex',maxindex);
		var feedContent = feeds.entries;
		var unreadcount=0;
		var counter = 0;
		for(i= minindex;i<maxindex;i++)
		{
			if(isFirstTime)
			{
				if(window.localStorage.getItem("readMode") == SHOWUNREAD)
				{
					if(FeedController.isRead(feeds.feedUrl,feedContent[i].link))
					{
						console.log("Already read : " + i);
						continue;
					}
				}
			}
			if(isFirstTime && counter==0)
				FeedController.saveAsRead($("#feedurldiv").html(),feedContent[i].link); 
			console.log("i : " + i + "counter : " + counter);
			counter++;
			unreadcount++;
			if(feedContent[i] == null)
			{
				$("#hnext").hide();break;
			}
			var lielement = $('<li>').attr('class','panel' + (i+1));
			var headlineli = $('<li>').attr('slideno',counter-1).attr('link',feedContent[i].link);
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
		if(unreadcount ==0)
		{
			console.log("Unread count is 0");
			$("#slider").empty();
			$("#slider").html("<div class='textSlide'><center><h2 style='margin-top:50px;'>You have no unread feeds.</h2></center></div>");
			$("#slider").anythingSlider();
			console.log("Fading out");
			$("#readMessage").fadeOut("fast");
			$("#unreadMessage").fadeOut("fast");	
		}
		else if(parseInt($("#rdrheadl").attr('startindex')) == 0)
		{
			$("#readMessage").fadeIn("slow");
			$("#unreadMessage").fadeOut("fast");
		}
		if(!isFirstTime)
		{
			$("#readMessage").fadeOut("fast");
			$("#unreadMessage").fadeOut("fast");
		}
		if(unreadcount == 0 && parseInt($("#rdrheadl").attr('startindex')) == 0)
		{
			FeedController.setUnreadCount($("#feedurldiv").html,0);
		}
	},
	*/
	renderGoogleFeed : function(feeds,minindex,maxindex,isFirstTime)
	{
		console.log("Rendering Google Feed");
		temp_feed = feeds;
		$("#slider").empty();
		$("#rdrheadl").empty();
		var content = feeds.items;
		$("#viewOptionsBox option").attr("selected","");
		if(window.localStorage.getItem("readMode") == SHOWALL)
			$("#viewOptionsBox").val("1");
		else
			$("#viewOptionsBox").val("0");
		var length = 0;
		console.log("Slider feed");
		ReaderViewer.renderSliderFeed(temp_feed,minindex,maxindex,isFirstTime);
		console.log("rendering finished");
		switchToLoadingView(false);
		loadingFinished = true;
		$("#loadingScreen").css('visibility','hidden').css('display','none');
	},
	renderSliderFeed : function(feeds,minindex,maxindex,isFirstTime){
		
		$("#feedurldiv").html(feeds.feedUrl);
		$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');
		$("#rdrheadl").attr('startindex',minindex);
		$("#rdrheadl").attr('endindex',maxindex);
		var feedContent = feeds.items;
		var unreadcount=0;
		var counter = 0;
		for(i= minindex;i<maxindex;i++)
		{
			if(isFirstTime && counter==0)
				Reader.markAsRead($("#feedurldiv").html(),feedContent[i].link); 
			console.log("i : " + i + "counter : " + counter);
			counter++;
			unreadcount++;
			if(feedContent[i] == null)
			{
				$("#hnext").hide();break;
			}
			var lielement = $('<li>').attr('class','panel' + (i+1));
			var headlineli = $('<li>').attr('slideno',counter-1).attr('link',feedContent[i].id);
			var wrapdiv = $('<div>');
			var divelement = $('<div>').attr('class','textSlide');
			var title = "<a href = '" + feedContent[i].alternate[0].href + "'><h2>" + feedContent[i].title + "</h2></a>";
			$(headlineli).html("<h2>"+feedContent[i].title+"</h2>");
			if(feedContent[i].author != null)
				title+= "<h5 style='float:left'>"+feedContent[i].author+"</h5><br>";
			
			var description = "<p>" + feedContent[i].summary.content + "</p>";
			if(feedContent[i].publishedDate != null)
			{
				var date = "<h5 style='float:right;margin-top:3px;clear:both'>" + feedContent[i].published+"</h5>";
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
		if(unreadcount ==0)
		{
			console.log("Unread count is 0");
			$("#slider").empty();
			$("#slider").html("<div class='textSlide'><center><h2 style='margin-top:50px;'>You have no unread feeds.</h2></center></div>");
			$("#slider").anythingSlider();
			console.log("Fading out");
			$("#readMessage").fadeOut("fast");
			$("#unreadMessage").fadeOut("fast");	
		}
		else if(parseInt($("#rdrheadl").attr('startindex')) == 0)
		{
			$("#readMessage").fadeIn("slow");
			$("#unreadMessage").fadeOut("fast");
		}
		if(!isFirstTime)
		{
			$("#readMessage").fadeOut("fast");
			$("#unreadMessage").fadeOut("fast");
		}
		if(unreadcount == 0 && parseInt($("#rdrheadl").attr('startindex')) == 0)
		{
			FeedController.setUnreadCount($("#feedurldiv").html,0);
		}
		return;
	}
}
 