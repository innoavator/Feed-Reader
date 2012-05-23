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
	$('.subscbdimg').animate({'opacity': 1}, 200)
}
function showUnsubscribedFeed(icon)
{
	$(this).css('cursor','pointer');
    $('.caption',icon).stop(0,true,true).animate({'opacity': 0}, 200);
	$('img',icon).stop(0,true,true).animate({'opacity': 1}, 200);
}
function showMessage(msg)
{
	$("#error-message").fadeOut('fast',function(){$(this).html(msg)}).fadeIn().delay(1000).fadeOut('fast',function(){$(this).html("Click on the feed from the categories given below or enter the URL of the desired feed of your wish")}).fadeIn();
}

//===============================OAuth Util funcitons ====================================
function loginToGoogle()
{
	console.log("Logging into google");
	var redirect_uri = "https://www.example.com";
	var url = "https://accounts.google.com/o/oauth2/auth?"
			  +"scope=http://www.google.com/reader/api/&"
			  +"response_type=token&"
			  +"redirect_uri="+redirect_uri+"&"
			  +"client_id=241567971408-oqc99hgb5al8kc7pl1h05iejl65r30ft.apps.googleusercontent.com&"
			  +"access_type=offline";
	url = encodeURI(url);
	pokki.clearWebSheetCookies();
	pokki.showWebSheet(url,512,400,
						function(_url)
						{
							console.log("Opening websheet");
								console.log(_url);
							if(_url.indexOf(redirect_uri)!=-1)
							{
								var params = {}, queryString = location.hash.substring(1),regex = /([^&=]+)=([^&]*)/g, m;
								while (m = regex.exec(queryString)) 
								{
									params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
									window.localStorage.setItem("access_token",queryString);
									console.log(window.localStorage.getItem("access_token"));
									console.log("Access token received");
									break;
								}
								pokki.hideWebSheet();
								
							}
							console.log("Returning true");
							return true;
						},
						function(error)
						{
							if(error == user_abort)
							{
								console.log("User hit close button");
							}
							else{
								console.log("Error occured");
								pokki.hideWebSheet();
							}
						}
					);
	
}

function getData(url,data,callback)
{
	$.ajax(
	({
	  method: "get",
	  url: url,
	  data : data,
	  success: callback,
	  timeout: (15 * 1000),
	  statusCode : {
				401 : function(){
					console.log("Authorization failure. Access_token expired.");
					//Refresf access_token
				}
	  },
	  error: function( objAJAXRequest, strError ){
			console.log("Error : " + strError);
		} 
	}) 
	); 
}

function postData(url,data,callback)
{
	$.ajax(
	({
	  method: "post",
	  url: url,
	  data : data,
	  success: callback,
	  timeout: (15 * 1000),
	  statusCode : {
				401 : function(){
					console.log("Authorization failure. Access_token expired.");
					//Refresf access_token
				}
	  },
	  error: function( objAJAXRequest, strError ){
			console.log("Error : " + strError);
		} 
	}) 
	); 
}