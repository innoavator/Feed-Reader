var App = function() {
    var unloaded = new LocalStore('unloaded');
    var splash_ran = unloaded.get() ? true : false;
    
    // Initialize whatever else needs to be initialized
     FeedController.initialise();
	 FeedViewer.initialise();
  	 modes.initialise();
    // Kick off what needs to be done whenever the popup is about to be shown
    this.onPopupShowing = function() {    
    
    };
   
	// Kick off what needs to be done when the popup is hidden
    this.onPopupHidden = function() {
    
    };
    
    // Use this to store anything needed to restore state when the user opens the Pokki again
    this.onPopupUnload = function() {
        unloaded.set(true);
    };
};