var ReaderViewer={initialise:function(){$("#slider").anythingSlider({resizeContents:!0,navigationSize:!1,buildNavigation:!1,buildStartStop:!1,toggleArrows:!0,infiniteSlides:!1,onSlideComplete:function(){var a=$("#feedurldiv").html(),b=$(".activePage").attr("id"),c=$(".activePage").find(".textSlide").attr("slide-no");DbManager.getItemTag(a,b,function(a){a&&$(".activePage").find(".textSlide").attr("init-tag",a);$(".activePage").find(".textSlide").attr("final-tag","read")});Reader.getNextContent(a,c)},
onSlideInit:function(){$("#unreadMessage").fadeOut("slow");$("#readMessage").fadeOut("slow");var a=$("#feedurldiv").html(),b=$(".activePage").attr("id"),c=$(".activePage").find(".textSlide").attr("init-tag"),d=$(".activePage").find(".textSlide").attr("final-tag");d||(d="read");Reader.editItemTag(a,b,d,c);$("#readMessage").fadeIn(10)}});null==window.localStorage.getItem("readMode")?window.localStorage.setItem("readMode",SHOWUNREAD):$("#viewOptionsBox").val(window.localStorage.getItem("readMode"));
$("#viewOptionsBox").change(function(){window.localStorage.setItem("readMode",$(this).val());$("#loadingScreen").css("visibility","visible").css("display","block");Reader.getFeedContent($("#feedurldiv").html())});$("#readMessage").find("img").click(function(){$(".activePage").find(".textSlide").attr("final-tag","kept-unread");$("#readMessage").fadeOut("fast",function(){$("#unreadMessage").fadeIn("fast")})});$("#unreadMessage").find("img").click(function(){$(".activePage").find(".textSlide").attr("final-tag",
"read");$("#unreadMessage").fadeOut("fast",function(){$("#readMessage").fadeIn("fast")})});$(".textSlide a").live("click",function(){pokki.openURLInDefaultBrowser($(this).attr("href"))})},initialiseHeadlineView:function(){$("#headlview").live("click",function(){$("#rdrheadl").slideToggle()});$("#minimizeHeadlines").live("click",function(){$("#rdrheadl").slideUp()});$("#rdrheadl li").live("click",function(){var a=$(this).attr("slideno");$("#slider").anythingSlider(a)});$("#rdrheadl li").live("mouseenter focus mousedown",
function(){Reader.getNextContent($("#feedurldiv").html(),$(this).attr("slideno"))})},renderGoogleFeed:function(a,b,c,d){temp_feed=a;$("#feedurldiv").html(d);!0==GoogleReader.hasAuth()?($("#viewOptionsBox option").attr("selected",""),$("#viewOptionsBox").css("display:block"),window.localStorage.getItem("readMode")==SHOWALL?$("#viewOptionsBox").val("1"):$("#viewOptionsBox").val("0")):$("#viewOptionsBox").css("display","none");ReaderViewer.renderSliderFeed(temp_feed,b,c);$("#slider").anythingSlider();
$(".textSlide a").addClass("nivoZoom center");switchToLoadingView(!1);$("#loadingScreen").css("visibility","hidden").css("display","none")},renderSliderFeed:function(a,b,c){if(0==a.items.length)$("#slider").html("<div class='textSlide'><center><h2 style='margin-top:50px;'>You have no unread feeds.</h2></center></div>"),$("#slider").anythingSlider(),$("#readMessage").fadeOut("fast"),$("#unreadMessage").fadeOut("fast");else{$("#rdrheadl").append('<div id = "minimizeHeadlines"></div>');a=a.items;for(i=
0;i<c-b;i++)ReaderViewer.appendItem(a[i],i+b),ReaderViewer.appendHeadline(a[i],i+b)}},appendItem:function(a,b){var c=$("<li>").attr("class","panel"+parseInt(b)).attr("id",a.id),d=$("<div>"),e=$("<div>").attr("class","textSlide").attr("slide-no",b).attr("init-tag","").attr("final-tag",""),f="<a href = '"+a.alternate[0].href+"'><h2>"+a.title+"</h2></a>";null!=a.author&&(f+="<h5 style='float:left'>"+a.author+"</h5><br>");if(a.summary)var g="<p>"+a.summary.content+"</p>";else a.content.content?g="<p>"+
a.content.content+"</p>":a.content&&(g="<p>"+a.content+"</p>");if(null!=a.publishedDate){var h="<h5 style='float:right;margin-top:3px;clear:both'>"+(new Date(feedContent[i].published)).toLocaleString()+"</h5>";$(e).append(h)}$(e).append(f);$(e).append(g);$(d).append(e);$(c).append(d);$("#slider").append(c)},appendHeadline:function(a,b){var c=$("<li>").attr("slideno",b+1).attr("link",a.id);$(c).html("<h2>"+a.title+"</h2>");$(c).insertBefore("#headlactions")},showFetchError:function(a){$("#loadingScreen").html("Error fetching feed : "+
a+"<br>Please try again later.").fadeIn().delay(1E3).fadeOut(400,function(){$("#loadingScreen").css("visibility","hidden").css("display","none");$("#loadingScreen").html("<img src = 'img/feedsload.gif' />")})},showNextContentError:function(){}};
