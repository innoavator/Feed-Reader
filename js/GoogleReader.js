/* Google Reader Javascript Library */
/* Author : Abhishek Choudhary(abhishek@codeblues.in) */

/* Brief documentation */
/*  Feedid : the id of the feed source as recognised by Google. Its in the format feed/<feedurl>
	Feedurl : the url of the feed source.
*/
var GoogleReader;

GoogleReader = {
	
	access_token : "",
    api_token : "",
	refresh_token : "",
	redirect_uri : "http://www.codeblues.in",
	client : "scroll",
	tags : {
		"like": "user/-/state/com.google/like",
		"label": "user/-/label/",
		"star": "user/-/state/com.google/starred",
		"read": "user/-/state/com.google/read",
		"fresh": "user/-/state/com.google/fresh",
		"share": "user/-/state/com.google/broadcast",
		"kept-unread": "user/-/state/com.google/kept-unread",
		"reading-list": "user/-/state/com.google/reading-list"
	},
	/* Google Reader Feed URLS */
    SUBSCRIPTION_LIST_URL : "http://www.google.com/reader/api/0/subscription/list",
    SUBSCRIPTION_EDIT_URL : "http://www.google.com/reader/api/0/subscription/edit",
    API_TOKEN_URL : "http://www.google.com/reader/api/0/token",
	USER_INFO_URL : "http://www.google.com/reader/api/0/user-info",
	MARK_ALL_READ_URL : "http://www.google.com/reader/api/0/mark-all-as-read",
	EDIT_TAG_URL : "http://www.google.com/reader/api/0/edit-tag",
	UNREAD_COUNT_URL : "http://www.google.com/reader/api/0/unread-count",
	//Initialise the access_token
	initialise : function() 
	{
		this.access_token = window.localStorage.getItem("access_token");
		this.refresh_token = window.localStorage.getItem("refresh_token");
		this.getApiToken();
		console.log("Access_token : " + this.access_token);
		console.log("Refresh_token : " + this.refresh_token);
		/*if(!this.refresh_token || this.refresh_token.length == 0)
			this.loginViaOauth();
		else
			this.refreshAccessToken(); */
		//this.access_token = "ya29.AHES6ZQ4mHsRibLiA2VEYa08GPxcX-2uzy-2ThPhpAkp4Q";
	},
	
	
	/***************************************************************************************/
	/*						Authentication                                                 */
	/***************************************************************************************/
	loginViaOauth : function(callback)
	{
		var url = "https://accounts.google.com/o/oauth2/auth?"
			  +"scope=http://www.google.com/reader/api/&"
			  +"response_type=code&"
			  +"redirect_uri="+this.redirect_uri+"&"
			  +"client_id=241567971408-oqc99hgb5al8kc7pl1h05iejl65r30ft.apps.googleusercontent.com&"
			  +"access_type=offline&"
			  +"approval_prompt=force";
		url = encodeURI(url);
		pokki.clearWebSheetCookies();
		pokki.showWebSheet(url,512,400,function(_url)
			{
				if(_url.indexOf(GoogleReader.redirect_uri)==0)
				{
					console.log("redirecting...");
					console.log("Url : " + _url);
					var params = {}, queryString = _url.split("?")[1],regex = /([^&=]+)=([^&]*)/g, m;
					console.log("Query string : " + queryString);
					while (m = regex.exec(queryString)) 
					{
						params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
						var code = params[decodeURIComponent(m[1])];
						//Get the access token and refresh token
						var data = "code="+code+"&"
									+"client_id=241567971408-oqc99hgb5al8kc7pl1h05iejl65r30ft.apps.googleusercontent.com&"
									+"client_secret=HY11TSTGm7ydZrnkfwTHsUyK&"
									+"redirect_uri="+GoogleReader.redirect_uri+"&"
									+"scope=&"
									+"grant_type=authorization_code";
						$.ajax({
							type : "POST",
							url : "https://accounts.google.com/o/oauth2/token",
							data : data,
							dataType : "json",
							success : function(tokens){
										console.log(tokens);
										GoogleReader.setTokens(tokens.access_token,tokens.refresh_token,callback);
									},
							error : function(error){
										console.log(error);
									}
						});
						break;
					}pokki.hideWebSheet();
				}
				else{
					console.log("Returning true : " + _url);
					return true;
				}
			},
			function(error){
				if(error == "user_abort"){
					console.log("User hit close button");
				}else{
					console.log("Error occured" + error);
				}
				pokki.hideWebSheet();
				callback("Error : " + error);
			}
		);
		
	},
	getApiToken : function()
	{
	  $.get(GoogleReader.API_TOKEN_URL+"?access_token="+GoogleReader.access_token,function(token){
	    GoogleReader.api_token = token;
		console.log("Api token : " + token);
	  });
	},
	
	//Get a new access token from the refresh token
	refreshAccessToken : function(callback)
	{
		var data = "client_id=241567971408-oqc99hgb5al8kc7pl1h05iejl65r30ft.apps.googleusercontent.com&"
					+"client_secret=HY11TSTGm7ydZrnkfwTHsUyK&"
					+"refresh_token="+this.refresh_token+"&"
					+"grant_type=refresh_token";
		$.ajax({
				type : "POST",
				url : "https://accounts.google.com/o/oauth2/token",
				data : data,
				dataType : "json",
				success : function(tokens){
							console.log("Tokens : " + tokens);
							GoogleReader.setTokens(tokens.access_token,"",callback);
						},
				error : function(error){
							console.log(error);
						}
			});
	},
	
	setTokens : function(access_token,refresh_token,callback)
	{
		console.log("Access token : " + access_token);
		GoogleReader.access_token = access_token;
		this.getApiToken();
		window.localStorage.setItem("access_token",access_token);
		if(refresh_token && refresh_token.length>0)
		{
			console.log("Setting refresh token");
			window.localStorage.setItem("refresh_token",refresh_token);
			GoogleReader.refresh_token = refresh_token;
		}
		callback("OK");
	},
	
	getUserInfo : function(callback)
	{
		getData(this.USER_INFO_URL,null,callback);
	},
	
	logout : function(callback)
	{
		window.localStorage.setItem("isSyncOn","false");
		window.localStorage.setItem("access_token","");
		window.localStorage.setItem("refresh_token","");
		this.access_token = "";
		this.refresh_token = "";
	},
	
	/************************************************************************************/
	/*								Feed Handling										*/
	/************************************************************************************/
	//Get the subscription list of a user
	getSubscriptionList : function(callback) 
	{
		var data = "output=json&access_token="+this.access_token;
		this.getData(GoogleReader.SUBSCRIPTION_LIST_URL,data,callback);
	},
	
	/*Subscribe to the given feedurl. 
	  @param feedurl  : the feedsource to subscribe to.
	  @param recommendation : if subscribed from the recommendations, recommendation is true, else false.
	  @param callback : Callback function to be called 
	*/
	subscribe : function(feedurl,title,recommendation,callback)
	{
		console.log("Api token : " + GoogleReader.api_token);
    	var data = "s=feed/"+feedurl+"&"+
	             "ac=subscribe&"+
	             "T="+GoogleReader.api_token;
        this.postData(this.SUBSCRIPTION_EDIT_URL,data,callback);	  
	},
	
	/*Subscribe to the given feedurl. 
	  @param feedurl  : the feedsource to unsubscribe from.
	  @param callback : Callback function to be called 
	*/
	unsubscribe : function(feedurl,callback)
	{
      	var data = "s=feed/"+feedurl+"&"
             "ac=unsubscribe&"+
             "T="+this.api_token;
        postData(this.SUBSCRIPTION_EDIT_URL,data,callback);	  
	},
	
	addItemTag : function(feedid,itemid,tag,callback)
	{
		var data = "s="+feedid
					+"&ac=edit-tags"
					+"&async=true"
					+"&a="+this.tags[tag]
					+"&i="+itemid;
		postData(this.EDIT_TAG_URL,data,callback);
	},
	
	removeItemTag : function(feedid,itemid,tag,callback)
	{
		var data = "s="+feedid
					+"&ac=edit-tags"
					+"&async=true"
					+"&r="+this.tags[tag]
					+"&i="+itemid;
		postData(this.EDIT_TAG_URL,data,callback);
	},
	
	getUnreadCount : function(callback)
	{
		var data = "output=json&output=json&client="+this.client;
		this.getData(this.UNREAD_COUNT_URL,data,callback);
	},
	
	/*Mark All the items of a particular feed source as read */
	markAllAsRead : function(feedid,callback)
	{
		var data = "s="+feedid;
		this.postData(this.MARK_ALL_READ_URL,data,callback);
	},
	
	/***************************************************************/
	/*        Util Functions of the Google Reader Library          */ 
	 /**************************************************************/
	getData : function(url,data,callback)
	{
	    /* Make a get request to Google Reader */
        $.ajax({
	      method: "get",
	      url: url,
	      data : data,
		  dataType : "json",
	      success: callback,
	      timeout: (15 * 1000),
	      statusCode : {
		        		    401 : function(){
		      			    	console.log("Authorization failure. Access_token expired.");
			    		    	GoogleReader.refreshAccessToken(function(result){
								if(result == "OK")
									GoogleReader.getData(url,data,callback);
								//else
									//callback(null);
							});
		    		    }
	            },
	      error: function( objAJAXRequest, strError ){
			    console.log("Error : " + strError);
		    } 
	    });  
	},
	
	postData : function(url,data,callback)
	{
	  /* Send a post request to Google Reader*/
	  $.ajax({
	      type: "POST",
	      url: url,
	      data : data,
	      beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + GoogleReader.access_token);
                },
	      success: function(){if(callback) callback;},
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
	    }); 
    }
}

