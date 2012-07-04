/* Thos file contains the implemetation of the Keyboard shortcuts in the app. */

var Keyboard = {
	toMyFeeds : null,
	toAddFeeds : null,
	initialise : function()
	{
		this.toAddFeeds = KeyboardJS.bind.key('ctrl+a',function(){console.log("CTRL +a");modes.switchToMode(0);},null);
		this.toMyFeeds = KeyboardJS.bind.key('ctrl+m',function(){console.log("CTRL +a");modes.switchToMode(1)},null);
	}
}