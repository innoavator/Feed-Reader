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
					var feedUrl = $("#feedurldiv").html();
					var itemId = $(".activePage").attr('id');
					var slide_no = $(".activePage").find(".textSlide").attr("slide-no");
					if(GoogleReader.hasAuth() == true)
					{
						Reader.markAsRead(feedUrl,itemId,false);
						$("#readMessage").fadeIn(10);
					}
					 Reader.getNextContent(feedUrl,slide_no);
				},
				onSlideInit: function(slider) {
						$("#unreadMessage").fadeOut("slow");
						$("#readMessage").fadeOut("slow");
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
	   
		//Click on headlines event
		$("#rdrheadl li").live('click',function(){
			var slideno = $(this).attr('slideno');
			$('#slider').anythingSlider(slideno);
			});
		$("#rdrheadl li").live('mouseenter focus mousedown',function(){
			Reader.getNextContent($("#feedurldiv").html(),$(this).attr('slideno'));
		 })
	//	$("#headlactions a").live('click',function(){FeedViewer.loadAllFeeds( $("#rdrheadl").attr('startindex'));});
	},
	
	renderGoogleFeed : function(feeds,minindex,maxindex,feedUrl)
	{
		temp_feed = feeds;
		$("#feedurldiv").html(feedUrl);
		if(GoogleReader.hasAuth() == true)
		{
			$("#viewOptionsBox option").attr("selected","");
			$("#viewOptionsBox").css("display:block");
			if(window.localStorage.getItem("readMode") == SHOWALL)
				$("#viewOptionsBox").val("1");
			else
				$("#viewOptionsBox").val("0");
		}else
		{
			console.log("Display none");
			$("#viewOptionsBox").css("display","none");
		}
		var length = 0;
		ReaderViewer.renderSliderFeed(temp_feed,minindex,maxindex);
		$("#slider").anythingSlider();
		$(".textSlide a").addClass("nivoZoom center");
		loadingFinished = true;
		//Rendering finished. Stop the loading sign
		switchToLoadingView(false);
		$("#loadingScreen").css('visibility','hidden').css('display','none');
	},
	
	renderSliderFeed : function(feeds,minindex,maxindex){
		
		console.log(feeds);
		if(feeds.items.length ==0)
		{
			$("#slider").html("<div class='textSlide'><center><h2 style='margin-top:50px;'>You have no unread feeds.</h2></center></div>");
			$("#slider").anythingSlider();
			$("#readMessage").fadeOut("fast");
			$("#unreadMessage").fadeOut("fast");	
			return;
		}
		
		$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');
		var feedContent = feeds.items;
		for(i= 0;i<maxindex-minindex;i++)
		{
			if(i==0)
				Reader.markAsRead($("#feedurldiv").html(),feedContent[i].id); 
			ReaderViewer.appendItem(feedContent[i],i+minindex);
			ReaderViewer.appendHeadline(feedContent[i],i+minindex);
		}
		
		/*$("#rdrheadl").append('<li id = "headlactions"><div id="hprev"></div>'
							 +' <img src = "img/barload.gif" style="opacity:0;"/>'//+'<a href = "#">View All</a>'
							 + '<div id="hnext"></div></li>'); */
	},
	
	appendItem : function(feeditem,counter)
	{
		console.log("Counter : " + counter);
		console.log(feeditem);
		var lielement = $('<li>').attr('class','panel' + parseInt(counter)).attr("id",feeditem.id);
		var wrapdiv = $('<div>');
		var divelement = $('<div>').attr('class','textSlide').attr('slide-no',counter);
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
		var headlineli = $('<li>').attr('slideno',counter+1).attr('link',feeditem.id);
		$(headlineli).html("<h2>"+feeditem.title+"</h2>");
		//$("#rdrheadl").append(headlineli).insertBefore("#headlactions");
		$(headlineli).insertBefore("#headlactions");
	}
	
}
 