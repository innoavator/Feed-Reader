// Google Reader Library
var GoogleReader = {
	
	access_token : "",
	
	//Initialise the access_token
	initialise : function() {
		//this.access_token = window.localStorage.getItem("access_token");
		this.access_token = "ya29.AHES6ZQ6bCXyl3aBuEhZLms8kvoZEkLa2kNkheeSNCwqfky7XZXQTQ";
	},
	
	//Get the subscription list of a user
	getSubscriptionList : function() {
		var data = "access_token="+this.access_token;
		console.log(SUBSCRIPTION_LIST_URL);
		getData(SUBSCRIPTION_LIST_URL,data,ReaderController.handleSubscriptionList);
	},
}