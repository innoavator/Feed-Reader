/* Google Reader Javascript Library */
/* Author : Abhishek Choudhary(abhishek@codeblues.in) */

var GoogleReader = {
	
	access_token : "",
    api_token : "",
  	
	/* Google Reader Feed URLS */
    SUBSCRIPTION_LIST_URL : "http://www.google.com/reader/api/0/subscription/list",
    SUBSCRIPTION_EDIT_URL : "http://www.google.com/reader/api/0/subscription/edit",
    API_TOKEN_URL : "http://www.google.com/reader/api/0/token",
  
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
	
	/* Util Functions of the Google Reader Library */
	getData : function(url,data,callback)
	{
	    /* Make a get request to Google Reader */
        $.ajax({
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
	    });  
	},
	
	postData : function(url,data,callback)
	{
	  /* Send a post request to Google Reader*/
	  $.ajax({
	      method: "post",
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

