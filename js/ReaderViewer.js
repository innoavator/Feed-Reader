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
					//Mark the feed as read.
					if(GoogleReader.hasAuth() == true)
					{
						Reader.markAsRead($("#feedurldiv").html(),$(".activePage").attr('id'),false);
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
				Reader.keepUnread($("#feedurldiv").html(),$(".activePage").attr('id'));
				$("#readMessage").fadeOut("fast",function(){
				$("#unreadMessage").fadeIn("fast");
				});
			});
			$("#unreadMessage").find('img').click(function(){
				Reader.markAsRead($("#feedurldiv").html(),$(".activePage").attr('id'),true);
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
	
	renderGoogleFeed : function(feeds,minindex,maxindex,feedUrl)
	{
		temp_feed = feeds;
		$("#slider").empty();
		$("#rdrheadl").empty();
		$("#feedurldiv").html(feedUrl);
		$("#viewOptionsBox option").attr("selected","");
		if(window.localStorage.getItem("readMode") == SHOWALL)
			$("#viewOptionsBox").val("1");
		else
			$("#viewOptionsBox").val("0");
		var length = 0;
		ReaderViewer.renderSliderFeed(temp_feed,minindex,maxindex);
		//Rendering finished. Stop the loading sign
		switchToLoadingView(false);
		loadingFinished = true;
		$("#loadingScreen").css('visibility','hidden').css('display','none');
	},
	
	renderSliderFeed : function(feeds,minindex,maxindex){
		
		console.log(feeds);
		$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');
		$("#rdrheadl").attr('startindex',minindex);
		$("#rdrheadl").attr('endindex',maxindex);
		var feedContent = feeds.items;
		var unreadcount=0;
		var counter = 0;
		for(i= minindex;i<maxindex;i++)
		{
			if(counter==0)
				Reader.markAsRead($("#feedurldiv").html(),feedContent[i].id); 
			console.log("i : " + i + "counter : " + counter);
			counter++;
			unreadcount++;
			ReaderViewer.appendItem(feedContent[i]);
			ReaderViewer.appendHeadline(feedContent[i],counter);
			$("#slider").anythingSlider();
			$(".textSlide a").addClass("nivoZoom center");
		}
		
		$("#rdrheadl").append('<li id = "headlactions"><div id="hprev"></div>'
							 +' <img src = "img/barload.gif"/>'//+'<a href = "#">View All</a>'
							 + '<div id="hnext"></div></li>');
		/*if(unreadcount ==0)
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
		}*/
		return;
	},
	
	appendItem : function(feeditem)
	{
		var lielement = $('<li>').attr('class','panel' + (i+1)).attr("id",feeditem.id);
		var wrapdiv = $('<div>');
		var divelement = $('<div>').attr('class','textSlide');
		var title = "<a href = '" + feeditem.alternate[0].href + "'><h2>" + feeditem.title + "</h2></a>";
		if(feeditem.author != null)
			title+= "<h5 style='float:left'>"+feeditem.author+"</h5><br>";
		var description = "<p>" + feeditem.summary.content + "</p>";
		if(feeditem.publishedDate != null)
		{
			var date = "<h5 style='float:right;margin-top:3px;clear:both'>" + (new Date(feedContent[i].published)).toLocaleString()+"</h5>";
			$(divelement).append(date);
		}
		$(divelement).append(title);
		$(divelement).append(description);
		$(wrapdiv).append(divelement);
		$(lielement).append(wrapdiv);
		$("#slider").append(lielement);

	},
	appendHeadline : function(feeditem,counter)
	{
		var headlineli = $('<li>').attr('slideno',counter-1).attr('link',feeditem.id);
		$(headlineli).html("<h2>"+feeditem.title+"</h2>");
		$("#rdrheadl").append(headlineli);
	}
	
}
 