var FeedViewer = {
	initialise : function()
	{
		FeedViewer.initialiseAddFeeds();
		FeedViewer.initialiseMyFeeds();
		FeedViewer.initialiseYoutubeFeeds();
		ReaderViewer.initialise();
		ReaderViewer.initialiseHeadlineView();
		GoogleReader.initialise();
		//Initialise Youtube Autosuggest
			jQTubeUtil.init({
		key: "AI39si7Br60Mhmvnb0iGT_DckKttQdd_8ghDOs_UQIcmb3wDhwAnZlkPe9lqp1llOv9rZNGqdKcdP8BdHRDOMaY4Mu0Xh3op9g",
		orderby: "viewCount",  // *optional -- "viewCount" is set by default
		time: "this_month",   // *optional -- "this_month" is set by default
		maxResults: 5   // *optional -- defined as 10 results by default
	});
		
		$("#tomyfeedsbtn").click(function(){FeedViewer.renderMyFeeds();modes.switchToMode(1);});
		$("#tomyfeedsbtn2").click(function(){readerToMyFeeds();});
		$(".toaddfeedsbtn").click(function(){modes.switchToMode(0);});
		
		$("#addFeedsForm").submit(function(){
			console.log("Form submitted");
		var selectedli = $(".filter .selected");
		if($(selectedli).attr('data-value') == "youtube")
		{
			FeedEngine.getVideos($(this).find("input")[1].value);
			return;
			
		}
		var feed_url = encodeURI($(this).find("input")[1].value);
		console.log(feed_url);
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		if(regexp.test(feed_url))
		{
			if(FeedController.issubscribed(feed_url) == 0)
			{
				$('#loadingurl').css('opacity',1);
				FeedViewer.sendForSubscription(feed_url);
			}else{
				$('#loadingurl').css('opacity',0);
				showMessage("<b>You are already subscribed to this feed. Go to Myfeeds page to view the feeds.</b>");
        	}
		}
		else{
			$('#loadingurl').css('opacity',0);
			$("#searchbox").find('input')[1].value = "";
			//FeedEngine.searchFeed(feed_url);
			showMessage("<b>Please Enter a Valid Url!!!</b>");
		}
		 });
	},
	initialiseAddFeeds : function()
	{
		var myFeedsList = FeedController.listFeeds();
		if(myFeedsList != null)
		{
			$("#stage li").each(function(i){
			if(myFeedsList.indexOf($(this).attr('data-id')) != -1)
				showSubscribedFeed($(this));
				else
				showUnsubscribedFeed($(this));
			});
		}
		else
		{
			$("#stage li").each(function(i){
			$('.caption',this).html('Click me to subscribe to '+$('img',this).attr('title'))
			});
		}
		/*Youtube suggestion click event : Get results for the clicked search result */
		$("#youtubeSuggestions li").live('click',function(){
			var query = $(this).text();
			$("#youtubeSuggestions").css('display','none');
			$("#searchbox").find('input')[1].value =query;
			FeedEngine.getVideos(query);
		});
		
		$('.grimg li').hover(function() 
		{
			var selectedli = $(".filter .selected");
			$('.fdname', this).css('text-decoration', 'underline')
		if($(selectedli).attr('data-value') != "youtube")
			{var feed_url = $(this).attr('data-id');
			if($('.caption',this).html()== 'Click me to subscribe to '+$('img',this).attr('title'))
			{
				$('.caption',this).stop(true,true).animate({'opacity': 1,'margin-top': -60}, 50);
        		$('img',this).stop(true,true).animate({'opacity': 0.1}, 100);
			}
			else
			if(FeedController.issubscribed(feed_url) == 1)
			{
				$('.caption',this).fadeOut(100,function(){
						$(this).html('Click to Unsubscribe').css('margin-top','-55px')}).stop(true, true).fadeIn(50);
				}
			}},function() 
			{
				var selectedli = $(".filter .selected");
				$('.fdname', this).css('text-decoration', 'none')
		if($(selectedli).attr('data-value') != "youtube"){
				var feed_url = $(this).attr('data-id');
				if($('.caption',this).html()== 'Click me to subscribe to '+$('img',this).attr('title'))
				{
        			$('.caption',this).stop(0,true,true).animate({'opacity': 0}, 50);
					$('img',this).stop(0,true,true).animate({'opacity': 1}, 200);
				}
				else
				if(FeedController.issubscribed(feed_url) == 1)
				{
					
					$('.caption',this).fadeOut(100,function(){
						$(this).html('You are subscribed to '+$(this).parent().find('.feedimage').attr('title')+'<br>'+'<img class="subscbdimg" src="img/done.png">').css('margin-top','-60px')}).stop(0,true, true).fadeIn(50); 
				}
			}
			});
		// Attach handlers for click on feedIcons
		$(".grimg li").live('click',function(){
			var caption = $(this).find('.caption');var selectedli = $(".filter .selected");
		if($(selectedli).attr('data-value') != "youtube")
			{
			if(caption.html()!="Click to Unsubscribe")
			{
				var feedobj = $(this);
				var feed_url = $(this).attr('data-id');
					$('.caption',this).html('<img src="img/addfeed.gif">'+'<br>'+'Subscribing. Please Wait...');
				$('.caption',this).animate({'opacity': 1, 'margin-top': -80 }, 50);
				
					$('img',this).animate({'opacity': 0.1}, 200);
					$('.caption img',this).animate({'opacity': 1}, 0);
					FeedViewer.sendForSubscription(feed_url,feedobj);
			}
			else
			{
				url = $(this).attr('data-id');
				if(FeedController.removeFeed(url))
				{
					showUnsubscribedFeed($(this));
				}
			}
		}});
		$(".filter a").live('click',function(){
				
				if($(this).attr('class') == 'selected')
					return;
				$(".filter a").removeClass('selected');
				var multiple=$(this).attr('class');
				$(this).addClass('selected');
				var field = $(this).attr('data-value');
				if(field == "youtube"){
					
					$('#addFeedsForm img').attr('src','img/search-dark.png')
					$("#error-message").html("Search in the SearchBox above for Youtube Videos.");
					$('#addFeedsForm').find('span').text('Search Youtube:');}
				else{
					$('#addFeedsForm img').attr('src','img/add.png')
					$("#error-message").html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish");
					$('#addFeedsForm').find('span').text('Add Feeds:');
					}
				var finval=multiple*950*(-1)+40;
				$("#container").animate({'margin-left': finval}, 300);
		});
        // Youtube results captions
		$(".videolistitem").live('mouseenter',function(){
			$('.utubecaption',this).stop(true,true).animate({'opacity': 1, 'z-index':100000}, 50);
			$('img',this).stop(true,true).animate({'opacity': 0.2, 'z-index':10}, 100)});
		$(".videolistitem").live('mouseleave',function(){
			$('.utubecaption',this).stop(0,true,true).animate({'opacity': 0, 'z-index':100000}, 50);
			$('img',this).stop(0,true,true).animate({'opacity': 1, 'z-index':10}, 100);});
				
			
		$("#feedback").click(function(){pokki.openURLInDefaultBrowser("http://www.codeblues.in/softwares/feedreader.php");})
	},
	initialiseYoutubeFeeds	: function()
	{
		var selectedli= $('#vcatlist li .selected');
		FeedEngine.showVideos($(selectedli).attr('data-value'));
	},
	initialiseMyFeeds : function()
	{
		FeedViewer.renderMyFeeds();
		
		//Attach handler forunsubscribing feeds
		$(".feedl").live('click',function(event){
				event.stopPropagation();
				$("#loadingScreen").css('visibility','visible').css('display','block');
				var url = ($(this).attr("rel"));
				Reader.getFeedContent(url,null,ReaderViewer.showFetchError);
			
				
		});
		$('.videolistitem').live('click', function(){
				
				var link =  $(this).attr('link');console.log(link);
				$("#forscroll").animate({'margin-left': -950}, 300);
				
				if($('#fwdbutton').css('display')=='none')
					$('#fwdbutton').css('display','block');
				
				if($('#closevideo').css('display')=='none')
					$('#closevideo').css('display','block');
				
				if($('.youtube-player').attr('src')==link){
				return;
					}
					else
					{FeedViewer.showVideo(link);
						$('.nowplaying').css('display','none');	
						$(this).find('.nowplaying').css('display','block');			
				return;
					$('#firstpage')}
			});
			$('#closevideo').live('click',function (){
				$('.youtube-player').attr('src',"");
				$('.nowplaying').css('display','none');
				$('#fwdbutton').css('display','none');
				$("#forscroll").animate({'margin-left': 0}, 300);
				});
			$('#fwdbutton').live('click',function(){
				$("#forscroll").animate({'margin-left': -950}, 300);
				});
		$('#backbutton').live('click', function(){
			$("#forscroll").animate({'margin-left': 0}, 300);
		});
		
		$('#vcatlist a').live('click',function(){
				
				if($(this).attr('class') == 'selected')
					return;
				$("#vcatlist a").removeClass('selected');
				$("#videosbox").css('background','url(img/feedsload.gif) 280px 150px no-repeat #111');			
				var multiple=$(this).attr('class');
				$(this).addClass('selected');
					$('.videoslist').empty();
				var field = $(this).attr('data-value');
				FeedEngine.showVideos(field);
		});
	
		$('.unsub').live('mouseenter',function(){
			$(this).css('opacity','1');		
			});
		$('.unsub').live('mouseleave',function(){
				$(this).css('opacity','0.3');
			});
		$(".unsub").live('click',function(event){
		    event.stopPropagation();
			//console.log("Unsub button clicked");
			if(modes.currentmode == modes.myFeedsMode)
				url = $(this).parent().attr('rel');
			var obj = $(this);
			Reader.unsubscribe($(this).parent().attr('rel'),function(){
					console.log("Unsubscribing from feed\n");
					$(obj).parent().hide("fast",function(){$(this).parent().remove();});
					$("#stage li").each(function(){
					if($(this).attr('data-id') == url)
						showUnsubscribedFeed($(this));
					});
			});
		});
		
	},
	renderMyFeeds : function(){
		
			$("#myfeedsdiv .myfeedlist").empty();
			var list = FeedController.getMyFeeds();
			if(list == null) return;
			for(var i =0;i<list.length;i++)
			{
				var feed = new LocalStore(list[i]);
				var feedinfo = feed.get(list[i]);
				
				if(feedinfo == null){
					i++;continue;
				}
				var title = JSON.parse(feedinfo).title;
				if(GoogleReader.hasAuth() == true){
					var unreadCount = JSON.parse(feedinfo).unreadCount;
				}
				var imagesource=getDomain(list[i])+"/favicon.ico";
				var randomnumber=Math.floor(Math.random()*5);
				if(GoogleReader.hasAuth() == true)
					var countstr = "<div class='readunread'>"+unreadCount+"</div></div></li>";
				else
					var countstr = "";
				$("#myfeedsdiv .myfeedlist").append("<li><div class='feedl color"+randomnumber+"' rel = " +list[i] +" >"
					+"<div class='unsub'></div>"+"<div class='readmarker'></div>"+"<img class='faviconimg' src='"+imagesource+"'/><p>"+title.substring(0,25)+"</p>"+countstr);
					
			}
			/* Put the default imaage if the favicon image is not found*/
			$('.faviconimg').error(function() {
				$(this).attr("src", "img/defaultfavicon.png");
			});
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
	showSubscriptionTimeout : function(feedobj,caption)
	{
	//	clearTimeout(subscriptionTimer);
	/*	if($(feedobj).find('.caption')!= caption)
		{
			{
				$("#searchbox").find('input:text').val("");
				$('#loadingurl').css('opacity',0);
				$(feedobj).find('.caption').html(caption);
				$("#error-message").fadeOut('fast',function(){$(this).html("<b>Connection Timeout. May be you are not connected to Internet</b>")}).fadeIn().delay(1200).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();
			}
		}*/
	},
	
	showSuccessfulSubscription : function(feed_name,url,feedobj)
	{
			if(feedobj != null){
				/* Subscribed by clicking on one of the standard feeds */
				showSubscribedFeed(feedobj);
			}else{
				/* Subscribed from the add feeds textbox*/
				console.log("Searching for display : " + url);
				$("#searchbox").find('input')[1].value = "";
				$("#stage li").each(function(){
					if($(this).attr('data-id') == url)
					{
						console.log("Equal data-id");
						showSubscribedFeed($(this));
					}
				
				});
			}
			$('#loadingurl').css('opacity',0);
			showMessage("<b>Successfully subscribed to " + feed_name + "</b>");
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
		
			
			if(($(this).text().toLowerCase()).indexOf(feedname) == -1)
				
				$(this).fadeOut("fast");
			else
				$(this).fadeIn("slow");;
			});
		}
	},
	
	listVideos:	function(videoData)
	{
		function secondsToTime(secs)
	{
		var hours = Math.floor(secs / (60 * 60));
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		var obj = {
			"h": hours,
			"m": minutes,
			"s": seconds
		};
		return obj;
	}
		$(".videoslist").empty();
		
		var content = videoData.feed.entry;
		var i = 0;
		for(i = 0;i<content.length;i++)
		{
			var idarr = (content[i].id.$t).split("/");
			var url = idarr[idarr.length - 1];
			var li = $("<li>").attr('link','http://www.youtube.com/embed/'+url+'?autoplay=1&playerapiid=ytplayer&version=3&enablejsapi=1').attr('class','videolistitem');
			
			$(li).append("<img src = '"+content[i].media$group.media$thumbnail[0].url+"'/>");
			$(li).append("<div class='utubecaption'>"+content[i].media$group.media$title.$t+"<br><font color='yellow'>Duration: "+secondsToTime(content[i].media$group.yt$duration.seconds).h+"h "+secondsToTime(content[i].media$group.yt$duration.seconds).m+"m "+secondsToTime(content[i].media$group.yt$duration.seconds).s+"s"+"</font><br><font color='red'>-"+content[i].author[0].name.$t+"</font></div>");$(li).append("<div class='nowplaying'></div>");
			var link=$('#youtube-player').attr('src');
				$('.videolistitem[link="'+link+'"]').find('.nowplaying').css('display','block');
			$(".videoslist").append(li);
			//console.log(content[i].media$thumbnail); 
		}
		$("#videosbox").css('background','#111');
	},
	showVideo : function(videoUrl)
	{
		$(".youtube-player").attr('src',videoUrl);
			console.log(videoUrl);
	},
	updateFeedCount : function(urlObj)
	{
		$(".feedl").each(function(i){  
			if(($(this).attr('rel')).localeCompare(urlObj.url) == 0)
			{
				$(this).parent().find(".readunread").html(urlObj.count);
			}
			});
	},
	
	sendForSubscription : function(feed_url,feedobj)
	{
		GoogleReader.getFeedContent(feed_url,20,"","",function(feedinfo){
									feedinfo.id = feedinfo.id.substr(5);
									Reader.subscribe(feedinfo);
									FeedViewer.showSuccessfulSubscription(feedinfo.title,feedinfo.id,feedobj);
									FeedViewer.initialiseMyFeeds();
								},function(errorStr){
									console.log("Error sending : " +  errorStr);
									$("#searchbox").find('input:text').val("");
									$("#searchbox img").css("opacity","0");
									$('#loadingurl').css('opacity',0);
									if(errorStr == "Not Found")
										showMessage("<strong>Sorry, We could not find feeds at this url.</strong>");
									else
										showMessage("<strong>Error Subscribing to Feed. Please try again later.</strong>");

								});

	}
	
};
