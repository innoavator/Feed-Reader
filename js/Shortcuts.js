/* Thos file contains the implemetation of the Keyboard shortcuts in the app. */

var Keyboard = {
	toMyFeeds : null,
	toAddFeeds : null,
	scrollDownFeed : null,
	scrollUpFeed : null,
	initialise : function()
	{
		this.toAddFeeds = KeyboardJS.bind.key('ctrl+d',function(){switchToAddFeeds();},null);
		this.toMyFeeds = KeyboardJS.bind.key('ctrl+m',function(){switchToMyFeeds()},null);
	},
	
	initReaderShortcuts : function()
	{
		this.scrollDownFeed = KeyboardJS.bind.key('up',function(){console.log("up pressed");$(this).focus();},null);
		this.scrollDownFeed = KeyboardJS.bind.key('down',function(){console.log("down pressed");$(this).focus();$(this).trigger('click')},null);
	},
	
	uninitReaderShortcuts : function()
	{
	}
}