
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
				$("#error-message").fadeOut('fast',function(){$(this).html("<b>You are already subscribed to this feed. Go to Myfeeds page to view the feeds.</b>")}).delay(1000).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();	}
        }
		else{
			$("#searchbox").find('input:text').val("");
			FeedEngine.searchFeed(feed_url);
			$("#error-message").fadeOut('fast',function(){$(this).html("<b>Please Enter a Valid Url!!!</b>")}).fadeIn().delay(1000).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();
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
				$('.caption',this).html('You are subscribed to '+$('img',this).attr('title')+'<br>'+'<img class="subscbdimg" src="img/done.png">');
				$(this).css('cursor','default');
				$('.caption',this).animate({'opacity': 1,'margin-top': -60 }, 200);
		        $('img',this).animate({'opacity': 0.1}, 200);
				$('.subscbdimg').animate({'opacity': 1}, 200)
				
				$(this).hover(function(){
				
				$('.caption',this).fadeOut(200,function(){$(this).html('Unsubscribe?'+'<img class="unsub" style="display:block" src="img/unsub1.png">').css('margin-top','-55px')}).stop(true, true).fadeIn(200);}
				
				,function(){$('.caption',this).fadeOut(200,function(){$(this).html('You are subscribed to '+$(this).parent().find('.feedimage').attr('title')+'<br>'+'<img class="subscbdimg" src="img/done.png">').css('margin-top','-60px')}).stop(0,true, true).fadeIn(200);}
				
				);
				
			}
			});
		}
			
		$('.grimg li').mouseenter(function() {
			var feed_url = $(this).attr('data-id');
			if(FeedController.issubscribed(feed_url) == 0){
				$(this).css('cursor','pointer');
        $('.caption',this).html('Click me to subscribe to '+$('img',this).attr('title'));	
		$('.caption',this).stop(true,true).animate({'opacity': 1,'margin-top': -60}, 200);
        $('img',this).stop(true,true).animate({'opacity': 0.1}, 200);}
		$('.subscbdimg').css('opacity','1');
    }).mouseleave(function() {
		var feed_url = $(this).attr('data-id');
		if(FeedController.issubscribed(feed_url) == 0){
		$(this).css('cursor','pointer');
        $('.caption',this).stop(0,true,true).animate({'opacity': 0}, 200);
		$('img',this).stop(0,true,true).animate({'opacity': 1}, 200);}
			
    });
		$("#stage li").live('click',function(){
			var caption = $(this).find('.caption');
			var feedobj = $(this);
			
			var feed_url = $(this).attr('data-id');
			if(FeedController.issubscribed(feed_url) == 0)
			{
				subscriptionTimer = setTimeout(function(){FeedViewer.showSubscriptionTimeout(feedobj,caption)},15000);
				$('.caption',this).html('<img src="img/addfeed.gif">'+'<br>'+'Subscribing. Please Wait...');
			$('.caption',this).animate({'opacity': 1, 'margin-top': -80 }, 200);
		        $('img',this).animate({'opacity': 0.1}, 200);
		//	FeedController.issubscribed(feed_url) = 1;//correct the hover and leave thingy
			//$(this).mouseleave(function(e) {$('.caption',this).html('Subscribing. Please Wait...'+'<img src="img/addfeed.gif">');
		//	$(this).css('cursor','pointer');});
			//////////////////////////////////////////////////////////////
    
				FeedEngine.checkFeed(feed_url,feedobj,caption);
				}
			else
			{
				$("#error-message").fadeOut('fast',function(){$(this).html("<b>You are already subscribed to this feed. Go to Myfeeds page to view the feeds.</b>")}).fadeIn('fast').delay(1000).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();
			}
		});
		$(".filter a").live('click',function(){
				
				if($(this).attr('class') == 'selected')
					return;
				$(".filter a").removeClass('selected');
				var multiple=$(this).attr('class');
				$(this).addClass('selected');
				var field = $(this).attr('data-value');
				var finval=multiple*830*(-1)+6;
				$("#container").animate({'margin-left': finval}, 300);
				//$("#stage div").slideUp("slow");
				//$("#"+field+"-feeds").slideDown("slow");
				/*$("#stagediv").fadeOut('fast',function(){$(this).css('display','none')});
				$("#"+field+"-feeds").delay(250).fadeIn('fast',function(){$(this).css('display','block').show(0)});
				//$("#"+field+"-feeds").show("slow");*/
				
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
	showSubscriptionTimeout : function(feedobj,caption)
	{
	//	clearTimeout(subscriptionTimer);
		if($(feedobj).find('.caption')!= caption)
		{
			{
				$("#searchbox").find('input:text').val("");
				$(feedobj).find('.caption').html(caption);
				$("#error-message").fadeOut('fast',function(){$(this).html("<b>Connection Timeout. May be you are not connected to Internet</b>")}).fadeIn().delay(1200).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();
			}
		}
	},
	showSuccessfulSubscription : function(feed_name,url,feedobj,caption)
	{
			if(feedobj != null)
			{
				$(feedobj).find('.caption').html(caption);
				//$(feedobj).css("opacity","0.5");
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
			$("#error-message").fadeOut('fast',function(){$(this).html("<b>Successfully subscribed to " + feed_name + "</b>")}).fadeIn().delay(1200).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();
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
	
};

    