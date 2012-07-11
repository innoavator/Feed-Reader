var FeedViewer = {
	initialise : function()
	{
		FeedViewer.initialiseAddFeeds();
		FeedViewer.initialiseMyFeeds();
		YoutubeManager.initialiseYoutubeFeeds();
		ReaderViewer.initialise();
		ReaderViewer.initialiseHeadlineView();
		GoogleReader.initialise();
		//Keyboard.initialise();
		//Initialise Youtube Autosuggest
			jQTubeUtil.init({
		key: "AI39si7Br60Mhmvnb0iGT_DckKttQdd_8ghDOs_UQIcmb3wDhwAnZlkPe9lqp1llOv9rZNGqdKcdP8BdHRDOMaY4Mu0Xh3op9g",
		orderby: "viewCount",  // *optional -- "viewCount" is set by default
		time: "this_month",   // *optional -- "this_month" is set by default
		maxResults: 5   // *optional -- defined as 10 results by default
	});
		
		$("#tomyfeedsbtn").click(function(){switchToMyFeeds();});
		$("#tomyfeedsbtn2").click(function(){switchToMyFeeds();});
		$(".toaddfeedsbtn").click(function(){modes.switchToMode(0);});
		
		$("#addFeedsForm").submit(function(){
		var selectedli = $(".filter .selected");
		if($(selectedli).attr('data-value') == "youtube")
		{
			YoutubeManager.getVideos($(this).find("input")[1].value);
			return;
			
		}
		var feed_url = encodeURI($(this).find("input")[1].value);
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		if(regexp.test(feed_url))
		{
			DbManager.checkSubscription(feed_url,function(isSubscribed){
				if(isSubscribed != 1){
					$('#loadingurl').css('opacity',1);
					FeedViewer.sendForSubscription(feed_url,null);
				}else{
					$('#loadingurl').css('opacity',0);
					showMessage("<b>You are already subscribed to this feed. Go to Myfeeds page to view the feeds.</b>");
				}
			})
		}
		else{
			$('#loadingurl').css('opacity',0);
			$("#searchbox").find('input')[1].value = "";
			//YoutubeManager.searchFeed(feed_url);
			showMessage("<b>Please Enter a Valid Url!!!</b>");
		}
		 });
		
	},
	initialiseAddFeeds : function()
	{
		/* Render the Addfeeds Section */
		FeedViewer.renderAddFeeds();
		YoutubeManager.initYoutubeInAddfeeds();
		/*Youtube suggestion click event : Get results for the clicked search result */
		YoutubeManager.suggestionClick();
		
		/* Attach Event handlers for Hover on the feedicons */
		$('.grimg li').hover(function() {
			var feedobj = $(this);
			var selectedli = $(".filter .selected");
			$('.fdname', this).css('text-decoration', 'underline');
		    if($(selectedli).attr('data-value') != "youtube"){
			    var feed_url = $(this).attr('data-id');
				
				DbManager.checkSubscription(feed_url,function(isSubscribed){
					if(isSubscribed == 1){
						/* Feed Already subscribed. Show the message to unsubscribe*/
						$('.caption',feedobj).fadeOut(100,function(){
						$(this).html('Click to Unsubscribe').css('margin-top','-55px')}).stop(true, true).fadeIn(50);	
					}else{
						if($('.caption',feedobj).html()== 'Click me to subscribe to '+$('img',feedobj).attr('title')){
						$('.caption',feedobj).stop(true,true).animate({'opacity': 1,'margin-top': -60}, 50);
						$('img',feedobj).stop(true,true).animate({'opacity': 0.1}, 100);
						}
					}

				});
			}
		},function() {
				var feedobj = $(this);
				var selectedli = $(".filter .selected");
				$('.fdname', this).css('text-decoration', 'none')
		        if($(selectedli).attr('data-value') != "youtube")
				{
			    	var feed_url = $(this).attr('data-id');
					DbManager.checkSubscription(feed_url,function(isSubscribed){
						if(isSubscribed == 1){
							$('.caption',feedobj).fadeOut(100,function(){
								$(this).html('You are subscribed to '+$(this).parent().find('.feedimage').attr('title')+'<br>'
									 +'<img class="subscbdimg" src="img/done.png">').css('margin-top','-60px')}).stop(0,true, true).fadeIn(50);
						} 
						else if($('.caption',feedobj).html()== 'Click me to subscribe to '+$('img',feedobj).attr('title'))
						{
							$('.caption',feedobj).stop(0,true,true).animate({'opacity': 0}, 50);
							$('img',feedobj).stop(0,true,true).animate({'opacity': 1}, 200);		
						}
					});
				}
			});
		
		// Attach handlers for click on feedIcons
		$(".grimg li").live('click',function(){
			var feedobj = $(this);
			var caption = $(this).find('.caption');var selectedli = $(".filter .selected");
		    if($(selectedli).attr('data-value') != "youtube")
			{
			    if(caption.html()!="Click to Unsubscribe")
			    {
				    var feed_url = $(this).attr('data-id');
					$('.caption',this).html('<img src="img/addfeed.gif">'+'<br>'+'Subscribing. Please Wait...');
				    $('.caption',this).animate({'opacity': 1, 'margin-top': -80 }, 50);
				
					$('img',this).animate({'opacity': 0.1}, 200);
					$('.caption img',this).animate({'opacity': 1}, 0);
					FeedViewer.sendForSubscription(feed_url,feedobj);
			    }
			    else {
				    url = $(this).attr('data-id');
				    Reader.unsubscribe(url,function(){
						FeedViewer.renderMyFeeds();
					    showUnsubscribedFeed(feedobj);
				    });
			    }
		   }
		});
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
		YoutubeManager.captionAnim();				
			
		$("#feedback").click(function(){pokki.openURLInDefaultBrowser("http://www.codeblues.in/softwares/feedreader.php");})	
		
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
		
		/* Attach handlers for hover on unsubscribe link */
		$('.unsub').live('mouseenter',function(){
			$(this).css('opacity','1');		
			});
		$('.unsub').live('mouseleave',function(){
				$(this).css('opacity','0.3');
			});
		
		/* Attach Handlers for click on the Unsubscribe link */
		$(".unsub").live('click',function(event){
		    event.stopPropagation();
			if(modes.currentmode == modes.myFeedsMode)
				url = $(this).parent().attr('rel');
			var obj = $(this);
			Reader.unsubscribe($(this).parent().attr('rel'),function(){
					$(obj).parent().hide("fast",function(){$(this).parent().remove();});
					$("#stage li").each(function(){
					if($(this).attr('data-id') == url)
						showUnsubscribedFeed($(this));
					});
			});
		});
		
		/* Attach handlers for click on the MarkedRead thing*/
		$(".readmarker").live('click',function(event){
			var feedobj = $(this);
			event.stopPropagation();
			var feedUrl = $(this).parent().attr('rel');
			
			Reader.markAllAsRead(feedUrl,function(){
				$(feedobj).find('img').attr('src','img/marked2.png');
				$(feedobj).parent().find('.readunread').html("0");
			});
		});
		
	},
	
	renderAddFeeds : function()
	{
		DbManager.getSubscriptionIds(function(myFeedsList){
			if(myFeedsList != null){
				$("#stage li").each(function(i){
				if($.inArray($(this).attr('data-id'),myFeedsList)!=-1)
				//if(myFeedsList.indexOf($(this).attr('data-id')) != -1)
					showSubscribedFeed($(this));
				else
					showUnsubscribedFeed($(this));
				});
			}
			else
			{
				$("#stage li").each(function(i){
					$('.caption',this).html('Click me to subscribe to '+$('img',this).attr('title'));
				});
			}
	
		});
	},
	renderMyFeeds : function()
	{
			$("#myfeedsdiv .myfeedlist").empty();
			
			DbManager.getSubscriptions(function(subsList){
		        if(subsList == null) 
		            return;
		        for(var i =0;i<subsList.length;i++)
		        {
			        if(!subsList[i]){
				        i++;continue;
			        }
			        var title = subsList[i].title;
			        if(GoogleReader.hasAuth() == true){
				        var unreadCount = subsList[i].unreadCount;
			        }
			        var imagesource=getDomain(subsList[i].url)+"/favicon.ico";
			        var randomnumber=Math.floor(Math.random()*5);
			        if(GoogleReader.hasAuth() == true)
			        {
				        var countstr = "<div class='readunread'>"+unreadCount+"</div>";
				        if(unreadCount == 0)
					        countstr +="<div class='readmarker'><img src='img/marked2.png'></div></div></li>";
				        else
					        countstr+="<div class='readmarker'><img src='img/notify.gif'></div></div></li>";
			        }
			        else
				        var countstr = "";
    			    $("#myfeedsdiv .myfeedlist").append("<li><div class='feedl color"+randomnumber+"' rel = " +subsList[i].url +" >"
    				    +"<div class='unsub'></div>"+"<img class='faviconimg' src='"+imagesource+"'/><p>"+title.substring(0,25)+"</p>"+countstr);
		     }    
		});
		/* Put the default image if the favicon image is not found*/
			$('.faviconimg').error(function() {
				$(this).attr("src", "img/defaultfavicon.png");
			});
	
	},
	showSuccessfulSubscription : function(feed_name,url,feedobj)
	{
			if(feedobj != null){
				/* Subscribed by clicking on one of the standard feeds */
				showSubscribedFeed(feedobj);
			}else{
				/* Subscribed from the add feeds textbox*/
				$("#searchbox").find('input')[1].value = "";
				$("#stage li").each(function(){
					if($(this).attr('data-id') == url)
					{
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
		if(feedname == null || feedname == "")
			$("#myfeedsdiv .feedl").each(function(){
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
	
	
	updateFeedCount : function()
	{
		var count;
		$(".feedl").each(function(i){
			var obj = $(this);
			DbManager.getUnreadCount($(this).attr('rel'),function(count){
				$(obj).find('.readunread').html(count);
				if(count == 0)
					$(obj).find(".readmarker").find('img').attr('src','img/marked2.png');
				else
					$(obj).find(".readmarker").find('img').attr('src','img/notify.gif');
			});
		});
	},
	
	sendForSubscription : function(feed_url,feedobj)
	{
		GoogleReader.getFeedContent(feed_url,20,"","",function(feedinfo){
									feedinfo.id = feedinfo.id.substr(5);
									Reader.subscribe(feedinfo);
									FeedViewer.showSuccessfulSubscription(feedinfo.title,feedinfo.id,feedobj);
									FeedViewer.renderMyFeeds();
								},function(errorStr){
									$("#searchbox").find('input:text').val("");
									$('#loadingurl').css('opacity',0);
									if(errorStr == "Not Found")
										showMessage("<strong>Sorry, We could not find feeds at this url.</strong>");
									else
										showMessage("<strong>Error Subscribing to Feed. Please try again later.</strong>");
									if(feedobj){	
										$('.caption',feedobj).html('Error Subscribing to '+$(feedobj).find('img').attr('title')).animate({'opacity': 1,'margin-top': -60 }, 200).delay(2000).fadeOut(200).fadeIn(0,function(){
											$('.caption',feedobj).html();
											showUnsubscribedFeed(feedobj);
											});  
										}
								});
	}
};
