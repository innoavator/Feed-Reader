/* Google Reader Javascript Library */
/* Author : Abhishek Choudhary(abhishek@codeblues.in) */

/* Brief documentation */
/*  Feedid : the id of the feed source as recognised by Google.Its in the format feed/<feedurl>
	Feedurl : the url of the feed source.
*/
var GoogleReader;

GoogleReader = {
	
	access_token : "",
    api_token : "",
	
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
	
	//Initialise the access_token
	initialise : function() 
	{
		//this.access_token = window.localStorage.getItem("access_token");
		this.access_token = "ya29.AHES6ZQ4mHsRibLiA2VEYa08GPxcX-2uzy-2ThPhpAkp4Q";
		this.getToken();
	},
	
	getToken : function()
	{
	  $.get(GoogleReader.API_TOKEN_URL+"?access_token="+GoogleReader.access_token,function(token){
	    GoogleReader.api_token = token;
		console.log("Api token : " + token);
	  });
	},
	
	setTokens : function(tokendata)
	{
		console.log("Tokens received\n");
		console.log(tokendata);
	},
	
	getUserInfo : function(callback)
	{
		getData(this.USER_INFO_URL,null,callback);
	},
	
	//Get the subscription list of a user
	getSubscriptionList : function(callback) 
	{
		var data = "access_token="+this.access_token;
		this.getData(GoogleReader.SUBSCRIPTION_LIST_URL,data,callback);
	},
	
	/*Subscribe to the given feedurl. 
	  @param feedurl  : the feedsource to subscribe to.
	  @param recommendation : if subscribed from the recommendations, recommendation is true, else false.
	  @param callback : Callback function to be called 
	*/
	subscribe : function(feedurl,recommendation,callback)
	{
    	var data = "s=feed/"+feedurl+"&"
	             "ac=subscribe&"+
	             "T="+this.api_token;
        postData(this.SUBSCRIPTION_EDIT_URL,data,callback);	  
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
			    		    //Refresf access_token
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
	    }); 
    }
}

