
// JavaScript Document
var divnames = new Array();
divnames[0] = "#addfeedsdiv";
divnames[1] = "#myfeedsdiv";
/*divnames[2] = "#headlinesviewdiv"; */
divnames[2] = "#readerviewdiv";
var modes = {
	
	addFeedsMode : 0,
	myFeedsMode : 1,
//	headlinesMode : 2,
	readFeedMode  : 2,
	currentMode : 0,
	initialise : function(){
		modes.switchToMode(0);
	},
	switchToMode : function(nextstate){
		//		var done = false;
			//	console.log("Changing state");
			
				for(i = 0;i<3;i++)
				{
					if(i != nextstate)
					$(divnames[i]).fadeOut("slow",function()
					{
						if($(divnames[nextstate]).is(":hidden"))
						{
							$(divnames[nextstate]).show(function(){
							$(divnames[nextstate]).fadeIn("fast",function(){$(divnames[nextstate]).css('visibility','visible');});
																		});
						}
					});
				}
				if(nextstate == modes.myFeedsMode)
					$("#feedsearch").focus();
				
				modes.currentmode = nextstate;
			}
};
function readerToMyFeeds()
{
	modes.switchToMode(1);
	Reader.resetState();
	FeedViewer.renderMyFeeds();
	$("#slider").empty();
	$("#rdrheadl li").not('#headlactions').remove();
}
function display_message(message)
{
		 $('<div class="quick-alert">Alert! Watch me before it\'s too late!</div>')
    	.insertAfter( $(this) )
    	.fadeIn('slow')
    	.animate({opacity: 1.0}, 3000)
   		.fadeOut('slow', function() {
     	 $(this).remove();
    });
}

function getDomain(uri) {
	if (uri.substr(-1) != '/') {
        uri += '/';
    }
    var match = /(http:\/\/[^\/]+)/i.exec(uri);
    if (match && match.length > 1) {
        return match[1]; // return domain
    }

    return uri;
}
//Function for headlines view
function switchToLoadingView(cond)
{
	if(cond)
	{
		//$("#headlactions").find('a').hide();
		$("#hprev").hide();
		$("#hnext").hide();
		$("#headlactions").find('img').show();
	}
	else
	{
		//$("#headlactions").find('a').show();
//		console.log("Startindex : " + $("#rdrheadl").attr('startindex'));
		if(parseInt($("#rdrheadl").attr('startindex'))== 0)
		{
			$("#hprev").hide();
		}
		console.log("Hiding the loading of headlines.");
		$("#hnext").show();
		$("#headlactions").find('img').hide();
	}
}
function showSubscribedFeed(icon)
{
	$('.caption',icon).html('You are subscribed to '+$(icon).find('img').attr('title')+'<br>'+'<img class="subscbdimg" src="img/done.png">');
	$(icon).css('cursor','default');
	$('.caption',icon).animate({'opacity': 1,'margin-top': -60 }, 200);
	$('img',icon).animate({'opacity': 0.1}, 200);
	$('.subscbdimg').animate({'opacity': 1}, 200);
}
function showUnsubscribedFeed(icon)
{
	$(this).css('cursor','pointer');
    $('.caption',icon).stop(0,true,true).animate({'opacity': 0}, 200);
	$('img',icon).stop(0,true,true).animate({'opacity': 1}, 200);
}
function showMessage(msg)
{
	$("#error-message").fadeOut('fast',function(){$(this).html(msg)}).fadeIn().delay(2000).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();
}
function continueLocal()
{
	$('#loader').fadeOut(1000);
	$('#loadercontainer').fadeOut(1000); 
	$(".scrollable").css('opacity',1);	
}
function showProgress(value,isRelative)
{
	if(!$("#syncProgressBar").attr("value"))
		$("#syncProgressBar").attr("value",0);
	if(isRelative == true)
	{
		var currValue = parseInt($("#syncProgressBar").attr("value"));
		$("#syncProgressBar").attr("value",parseInt(value)+currValue);
	}else
		$("#syncProgressBar").attr("value",value);
}

function showLoaderMessage(msg)
{
	$("#loader").find('p').html(msg);
}

function addContextMenu()
{
	 pokki.resetContextMenu();
	 pokki.addContextMenuItem("Logout","logoutbtn");
	 pokki.addContextMenuItem("Mark All As Read","markallasread");
}

