
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
				$("#error-message").html("You are already subscribed to this feed. Go to Myfeeds page to view the feeds.").fadeIn().delay(2000).fadeOut(400);			}
        }
		else{
			$("#searchbox").find('input:text').val("");
			FeedEngine.searchFeed(feed_url);
			$("#error-message").html("Please Enter a Valid Url").fadeIn().delay(2000).fadeOut(400);
		}
		 });
		$(".textSlide a").live('click',function()
		{
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
			if($(this).attr('class') == "youtubeResultsli")
			{
				var link =  $(this).attr('link');
				FeedViewer.showVideo(link);	
				return;
			}
			var imgsrc = $(this).find('img').attr('src');
			var feedobj = $(this);
			
			var feed_url = $(this).attr('data-id');
			if(FeedController.issubscribed(feed_url) == 0)
			{
				subscriptionTimer = setTimeout(function(){FeedViewer.showSubscriptionTimeout(feedobj,imgsrc)},15000);
				$(this).find('img').attr('src','img/addfeed.gif');
				FeedEngine.checkFeed(feed_url,feedobj,imgsrc);
			}
			else
			{
				$("#error-message").html("You are already subscribed to this feed.Go to Myfeeds Page to view feeds.").fadeIn().delay(2000).fadeOut(400);
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
		$("#feedback").click(function(){pokki.openURLInDefaultBrowser("http://www.codeblues.in/softwares/feedreader.php");})
		
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
				$("#stage li").each(function(){
					if($(this).attr('data-id') == url)
					$(this).css("opacity","1")
				});
			});
	},
	renderVideos : function(videoData){
		
		console.log(videoData);
		$("#stage #youtube-feeds").empty();
		var content = videoData.feed.entry;
		var ul = $('<ul>').attr('id','youtubeResultsul');
		var i = 0;
		for(i = 0;i<content.length;i++)
		{
			var idarr = (content[i].id.$t).split("/");
			var url = idarr[idarr.length - 1];
			var li = $("<li>").attr('link','http://www.youtube.com/embed/'+url+'?autoplay=1').attr('class','youtubeResultsli');
			$(li).append("<img src = '"+content[i].media$group.media$thumbnail[0].url+"'/>");
			$(ul).append(li);
			//console.log(content[i].media$thumbnail); */
		}
		$("#stage #youtube-feeds").append(ul);
	},
	showVideo : function(videoUrl)
	{
		$('.youtubeResultsli').hide("slow");
/*		var str = '<iframe class="Video-IFrame-YouTube" src="http://www.youtube.com/embed/' + videoUrl + '?';
	//	if (Autoplay == "On") Str2 += 'autoplay=1';
		str += '&html5=1&showinfo=0" frameborder="0" allowfullscreen></iframe>';
		console.log(str); */
		var str = '<a href = "#" onClick="FeedViewer.closeVideo()">Close</a>';
		str += '<iframe class="youtube-player" type="text/html" width="580" height="320" src="'+videoUrl+'" frameborder="0"></iframe>';
		$('#youtube-feeds').append(str);
	},
	closeVideo : function()
	{
		$("#youtube-feeds").find('iframe').remove();
		$("#youtube-feeds").find('a').remove();
		$('.youtubeResultsli').show("slow");
		
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
	//	clearTimeout(subscriptionTimer);
		if($(feedobj).find('img').attr('src') != imgsrc)
		{
			{
				$("#searchbox").find('input:text').val("");
				$(feedobj).find('img').attr('src',imgsrc);
				$("#error-message").html("Connection Timeout. May be you are not connected to Internet").fadeIn().delay(500).fadeOut(400);
			}
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
			$("#error-message").html("Successfully subscribed to <b>" + feed_name + "</b>").fadeIn().delay(500).fadeOut(0);
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
