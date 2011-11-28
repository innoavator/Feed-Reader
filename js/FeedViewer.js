var subscriptionTimer;
var inSubscriptionState = false;
var loadingFinished = true;
var FeedViewer = {
	initialise : function()
	{
		FeedViewer.initialiseAddFeeds();
		FeedViewer.initialiseMyFeeds();
//		FeedViewer.addKeyboardControls();
		ReaderViewer.initialise();
		ReaderViewer.initialiseHeadlineView();
		
		$("#tomyfeedsbtn").click(function(){modes.switchToMode(1);});
		$("#tomyfeedsbtn2").click(function(){modes.switchToMode(1);});
		$(".toaddfeedsbtn").click(function(){modes.switchToMode(0);});
		
		$("#addFeedsForm").submit(function(){								   
		var feed_url = encodeURI($("input:first").val());
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		if(regexp.test(feed_url))
		{
			if(feed_url.charAt(feed_url.length -1)=="/")
				feed_url = feed_url.substring(0,feed_url.length -1);
			
			if(FeedController.issubscribed(feed_url) == 0)
			{
				$("#searchbox").find('img').css('opacity',1);
				FeedEngine.checkFeed(feed_url,null,"");
			}
			else
			{
				$("#error-message").html("You are already subscribed to this feed. Go to Myfeeds page to view the feeds.").fadeIn().delay(2000).fadeOut(400);
			}
        }
		else{
			$("#searchbox").find('input:text').val("");
			FeedEngine.searchFeed(feed_url);
			$("#error-message").html("Please Enter a Valid Url").fadeIn().delay(2000).fadeOut(400);
		}
		 });
		$(".textSlide a").live('click',function()
		{
			console.log("Link clicked");
				var url = $(this).attr("href");
				pokki.openURLInDefaultBrowser(url);
		});  
		
	},
	initialiseAddFeeds : function()
	{
		var myFeedsList = FeedController.listFeeds();
		if(myFeedsList != null)
		{
			$("#stage li").each(function(i){
			if(myFeedsList.indexOf($(this).attr('data-id')) != -1)
			{
				$(this).css("opacity","0.5");
			}
			});
		}
		
		$("#stage li").live('click',function(){
			var imgsrc = $(this).find('img').attr('src');
			var feedobj = $(this);
			
			var feed_url = $(this).attr('data-id');
			if(FeedController.issubscribed(feed_url) == 0)
			{
				subscriptionTimer = setTimeout(function()
							{
								FeedViewer.showSubscriptionTimeout(feedobj,imgsrc)},10000);
				//subscriptionTimer = setTimeout("FeedViewer.showSubscriptionTimeout()",3000);
				inSubscriptionState = true;
				$(this).find('img').attr('src','img/addfeed.gif');
				FeedEngine.checkFeed(feed_url,feedobj,imgsrc);
			}
			else
			{
				$("#error-message").html("You are already subscribed to this feed.Go to Myfeeds Page to view feeds.").fadeIn().delay(2000).fadeOut(400);
				//display_message("You are subscribed to this feed.");
			}
		});
		$(".filter li").live('click',function(){
				
				if($(this).attr('class') == 'selected')
					return;
				$(".filter li").removeClass('selected');
				$(this).addClass('selected');
				var field = $(this).find('a').attr('data-value');
				//$("#stage div").slideUp("slow");
				//$("#"+field+"-feeds").slideDown("slow");
				$("#stage div").css('display','none');
				//$("#"+field+"-feeds").show("slow");
				$("#"+field+"-feeds").css('display','block').show(0);
		});
	},
	initialiseMyFeeds : function()
	{
		{
			$("#myfeedsdiv .myfeedlist").empty();
			var list = FeedController.getMyFeeds();
			if(list == null) return;
			for(var i =0;i<list.length;i++)
			{
				var feed = new LocalStore(list[i]);
				var feedinfo = feed.get(list[i]);
				if(feedinfo == null)
				{
					i++;
					continue;
				}
				var title = JSON.parse(feedinfo).title;
				var imagesource=getDomain(list[i])+"/favicon.ico";
				var randomnumber=Math.floor(Math.random()*5);
				$("#myfeedsdiv .myfeedlist").append("<li><div class='feedl color"+randomnumber+"' rel = " +list[i] +"><div class='unsub'></div><img class='faviconimg' src='"+imagesource+"'/><p>"+title.substring(0,25)+"</p></div></li>"); 
			}
		}
		$('.faviconimg').error(function() {
  			$(this).attr("src", "img/defaultfavicon.png");
  		});
		$(".feedl").live('click',function(){
				event.stopPropagation();
				if(loadingFinished)
				{
					loadingFinished = false;
					$("#loadingScreen").css('visibility','visible').css('display','block');
					var url = ($(this).attr("rel"));
					FeedEngine.showFeed(url);
				}
				
		});
		$(".feedl").live('mouseenter',function(){
			$(this).find('.unsub').css('display','block');		
			});
		$(".feedl").live('mouseleave',function(){
				$(this).find('.unsub').css('display','none');
			});
		//Attach handler forunsubscribing feeds
		$(".unsub").bind('click',function(){
			event.stopPropagation();
			var url = $(this).parent().attr('rel');
			if(FeedController.removeFeed($(this).parent().attr('rel')))
				$(this).parent().hide("fast",function(){$(this).parent().remove();});
				$("#stage li[data-id=" + url + "]").css('opacity',1);
			});
	},
	

	loadAllFeeds : function(startindex)
	{
	/*	
		$("#slider").empty();
		$("#feedurldiv").html(temp_feed.feedUrl);
		var feedContent = temp_feed.entries;
		var minindex = parseInt(startindex); 
		for(i= minindex;i<minindex + 10;i++)
		{
			if(feedContent[i] == null)
			break;
			var lielement = $('<li>').attr('class','panel' + (i+1));
			var wrapdiv = $('<div>');
			var divelement = $('<div>').attr('class','textSlide');
			var title = "<h2><a href = ' " + feedContent[i].link + " '>" + feedContent[i].title + "</a><h2>";
			if(feedContent[i].author != null)
				title+= "<h5>"+feedContent[i].author+"</h5>";
			
			var description = "<p>" + feedContent[i].content + "</p>";
			$(divelement).append(title);
			if(feedContent[i].publishedDate != null)
			{
				var date = "<h5 style='float:right;margin-top:-10px;margin-bottom:10px;'>" + feedContent[i].publishedDate+"</h5>";
				$(divelement).append(date);
			}
			$(divelement).append(description);
			$(wrapdiv).append(divelement);
			$(lielement).append(wrapdiv);
			$("#slider").append(lielement);
			$('#slider').anythingSlider();
			$(".textSlide a").addClass("nivoZoom center");
		}
//		modes.switchToMode(3); */
		
	},
	renderOneFeed : function(i)
	{
		if(temp_feed == null)
			return;
		var feedContent = temp_feed.entries[parseInt(i)];
		if(feedContent == null)
			return;
		$("#slider").empty();
		var lielement = $('<li>').attr('class','panel' + (i+1));
		var wrapdiv = $('<div>');
		var divelement = $('<div>').attr('class','textSlide');
		var title = "<h2><a href = ' " + feedContent.link + " '>" + feedContent.title + "</a><h2>";
		if(feedContent.author != null)
			title+= "<h5>"+feedContent.author+"</h5>";
		
		var description = "<p>" + feedContent.content + "</p>";
		$(divelement).append(title);
		if(feedContent.publishedDate != null)
		{
			var date = "<h5 style='float:right;margin-top:-10px;margin-bottom:10px;'>" + feedContent.publishedDate+"</h5>";
			$(divelement).append(date);
		}
		
		$(divelement).append(description);
		$(wrapdiv).append(divelement);
		$(lielement).append(wrapdiv);
		$("#slider").append(lielement);
		$('#slider').anythingSlider();
		$(".textSlide a").addClass("nivoZoom center");
	},
	addKeyboardControls : function(){
		$(document).keyup(function(e){
		// Stop arrow keys from working when focused on form items
			switch (e.which) {
				case 27:  //Esc key
					if(modes.currentMode > 0)
					modes.switchToMode(modes.currentMode - 1);
					break;
			}
		
			});
	},
	showSubscriptionTimeout : function(feedobj,imgsrc)
	{
		console.log("subscription timeout");
		if(inSubscriptionState)
		{
			clearTimeout(subscriptionTimer);
			if($(feedobj).attr('src')!=imgsrc)
			{
				$("#searchbox").find('input:text').val("");
				$("#addFeedsForm img").css('opacity',0);
				console.log(imgsrc);
				$(feedobj).find('img').attr('src',imgsrc);
				$("#error-message").html("Connection Timeout. May be you are not connected to Internet").fadeIn().delay(2000).fadeOut(400);
			}
		inSubscriptionState = false;
		}
	},
	showSuccessfulSubscription : function(feed_name,url,feedobj,imgsrc)
	{
			if(feedobj != null)
			{
				$(feedobj).find('img').attr('src',imgsrc);
				$(feedobj).css("opacity","0.5");
			}
			else
			{
				$("#searchbox").find('input:text').val("");
				$("#addFeedsForm img").css('opacity',0);
				$("#stage li").each(function(){
					if($(this).attr('data-id') == url)
					$(this).css("opacity","0.5")
				});
			}
			$("#error-message").html("Successfully subscribed to <b>" + feed_name + "</b>").fadeIn().delay(2000).fadeOut(0);
		},
	searchMyFeeds : function(feedname)
	{
		
		feedname = feedname.toLowerCase();
		console.log(feedname);
		if(feedname == null || feedname == "")
			$("#myfeedsdiv .feedl").each(function(){
				console.log("Showing all feeds");
				//$(this).css('display','block');
				$(this).fadeIn();
			});
		else
		{
			$("#myfeedsdiv .feedl").each(function(i){
		//	console.log($(this).text());
			
			if(($(this).text().toLowerCase()).indexOf(feedname) == -1)
				//$(this).css('display','none');
				$(this).fadeOut("fast");
			else
				$(this).fadeIn("slow");;
			});
		}
	}
	
	
}
function update_feed(feeds)
{
	// Google Feeds
	$("#slider2").empty();
	var feedContent = feeds.entries;
	for(i= 0;i<feedContent.length;i++)
	{
		var lielement = $('<li>').attr('class','panel' + (i+1));
		var wrapdiv = $('<div>');
		var divelement = $('<div>').attr('class','textSlide');
		var title = "<h2>" + feedContent[i].title + "<h2>";
		var description = "<p>" + feedContent[i].content + "</p>";
		$(divelement).append(title);
		$(divelement).append(description);
		$(wrapdiv).append(divelement);
		$(lielement).append(wrapdiv);
		$("#slider2").append(lielement);
		$('#slider2').anythingSlider();
		
	}  
}

