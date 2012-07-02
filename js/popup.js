// Global variable for our core app

// Register all the Event listeners
window.addEventListener('DOMContentLoaded', load, false);
pokki.addEventListener('popup_unload', unload);
pokki.addEventListener('popup_hidden', hidden);
pokki.addEventListener('popup_shown', shown);
var unloaded = new LocalStore('unloaded');
    var splash_ran = unloaded.get() ? true : false;

// Add listener for when the popup is first loaded
// Perform popup page initiation and configuration
// NOTE: DOMContentLoaded is the ideal event to listen for as it doesn't
// wait for external resources (like images) to be loaded
function load() {
	console.log('Popup page is loaded.');
	//Atom = new App();
	// attach click event to minimize button    
    // Initialize whatever else needs to be initialized

	 FeedViewer.initialise();
  	 modes.initialise();
	 pokki.resetContextMenu();
	 if(!window.localStorage.getItem("isSyncOn"))
	 	window.localStorage.setItem("isSyncOn","false");
	 IS_SYNC_ON = window.localStorage.getItem("isSyncOn");
	 console.log("is sync on : " + IS_SYNC_ON);
	 if(IS_SYNC_ON == "true"){
		 setInterval(function(){Reader.syncSubscriptions()},5000*24);
		 addContextMenu();
		 continueLocal();
		 
	 }else
	 {
		 console.log("sync is off");
		$("#loadercontainer").find("h3").hide(0);
		$("#loadercontainer").find("a").css("display","inline");
	 }
	//$('#loader').fadeOut(1000);
	//$('#loadercontainer').fadeOut(1000); 
	//$(".scrollable").css('opacity',1);
	  //FeedEngine.initialise();

}

// Add listener for when the page is unloaded by the platform 
// This occurs due to inactivity or memory usage
// You have 4 seconds from this event to save/store any data
function unload() {
	unloaded.set(true);
    console.log('Popup page is being unloaded.');
	// Time to save any state
}

// Add listener for when the popup window is showing
function showing() {
    console.log('Popup window is almost visible.');    
}
pokki.addEventListener('popup_showing', showing);

// Add listener for when the popup window is shown
function shown() {

	setTimeout(function(){
		//$('#loadercontainer').fadeOut(400);
    	//$('#loader').fadeOut(500);
		},1000);
	console.log('Popup window is visible.');
 	   
/// Add listener for when the popup window is shown


}


// Add listener for when the pop-up window is hidden
function hidden() {
    console.log('Popup window was hidden.');
}
