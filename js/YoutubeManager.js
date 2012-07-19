// YoutubeManager File
var YoutubeManager = {
	
	getYoutubeSuggestions : function(query)
	{
		var selectedli = $(".filter .selected");
		if($(selectedli).attr('data-value') == "youtube")
		{
			console.log("Fetching youtube suggestions\n");
			
			jQTubeUtil.suggest(query,function(response){ 
				//return response.suggestions;
				$("#youtubeSuggestions").empty();
				for(var i =0;i<5;i++)
				{
					if(response.suggestions[i]==null)
					break;
					$("#youtubeSuggestions").append("<li>"+response.suggestions[i]+"</li>");
					//console.log(response.suggestions[sug]);
				} 
				$("#youtubeSuggestions").css('display','block');
		}); 
		}
	},
	initialiseYoutubeFeeds	: function()
	{
		var selectedli= $('#vcatlist li .selected');
		YoutubeManager.showVideos($(selectedli).attr('data-value'));
	},
	initYoutubeInAddfeeds	: function()
	{
		var selectedli= $('#vcatlist li .selected');
		YoutubeManager.showVideos($(selectedli).attr('data-value'));
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
					else {
						$("#youtubedislike").removeClass('disabled');
						$("#youtubelike").removeClass('disabled');
						YoutubeManager.showVideo(link);
						var videoid = 
						$('.nowplaying').css('display','none');	
						$(this).find('.nowplaying').css('display','block');
						var videourl = ($("#youtubeplayer .youtube-player").attr('src').split("?")[0]).split("/");	
						var videoid = videourl[videourl.length -1];
						P3ServiceHandler.sendProfileData("youtube",videoid,"0");
						return;
					$('#firstpage')
					}
			});
			$('#closevideo').live('click',function (){
				$('.youtube-player').attr('src',"");
				$('.nowplaying').css('display','none');
				$('#fwdbutton').css('display','none');
				$("#forscroll").animate({'margin-left': 0}, 300);
				$("#youtubedislike").removeClass('disabled');
				$("#youtubelike").removeClass('disabled');
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
				YoutubeManager.showVideos(field);
		});

		/* Attach handlers for like/dislike videos */
		$('#youtubelike').live('click',function(){
			if(!$(this).hasClass('.disabled')){
				$("#youtubedislike").removeClass('disabled');
				$(this).addClass('disabled');
			    var videourl = ($("#youtubeplayer .youtube-player").attr('src').split("?")[0]).split("/");	
				var videoid = videourl[videourl.length -1];
				P3ServiceHandler.sendProfileData("youtube",videoid,"1");
			}
		});

		$('#youtubedislike').live('click',function(){
			if(!$(this).hasClass('.disabled')){
				$("#youtubelike").removeClass('disabled');
				$(this).addClass('disabled');
			    var videourl = ($("#youtubeplayer .youtube-player").attr('src').split("?")[0]).split("/");	
				var videoid = videourl[videourl.length -1];
				P3ServiceHandler.sendProfileData("youtube",videoid,"-1");
			}
		});
	},
	suggestionClick : function()
	{
		$("#youtubeSuggestions li").live('click',function(){
			var query = $(this).text();
			$("#youtubeSuggestions").css('display','none');
			$("#searchbox").find('input')[1].value =query;
			YoutubeManager.getVideos(query);
		});
	},
	captionAnim : function(){
		$(".videolistitem").live('mouseenter',function(){
			$('.utubecaption',this).stop(true,true).animate({'opacity': 1, 'z-index':100000}, 50);
			$('img',this).stop(true,true).animate({'opacity': 0.2, 'z-index':10}, 100)});
		$(".videolistitem").live('mouseleave',function(){
			$('.utubecaption',this).stop(0,true,true).animate({'opacity': 0, 'z-index':100000}, 50);
			$('img',this).stop(0,true,true).animate({'opacity': 1, 'z-index':10}, 100);});
	},
	getVideos : function(query)
	{
		$.ajax({
			  method: "get",
			  url: "http://gdata.youtube.com/feeds/api/videos?max-results=12&alt=json&format=1&q="+query,
			  success: function(result){
				YoutubeManager.listVideos(result);
		  	  },
			  
			  timeout: (15 * 1000),
			  dataType : "json"	,
			  error: function( objAJAXRequest, strError ){
				$("#youtube-feeds").empty().text("Error! Type: " +strError);
	  			}
			}); 
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
		$(".youtube-player").attr('src',videoUrl+"&access_token="+GoogleReader.access_token);
			console.log(videoUrl);
	},
	showVideos: function(query)
	{
			$.ajax({
			  method: "get",
			  url: query,
			  
			  success: function(result){
				YoutubeManager.listVideos(result);
		  	  	},
				timeout: (15 * 000),
			  dataType : "json"	,
			  error: function( objAJAXRequest, strError ){
				$(".videoslist").empty().text("Error! Type: " +strError);
	  			}
				
			  });
			  
	},
	
	searchFeed : function(query)
	{
		google.feeds.findFeeds(query,function(result){
		if (!result.error) 
		{
			console.log(result);
		}
	});
	},
	
};
