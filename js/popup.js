window.addEventListener("DOMContentLoaded",load,!1);pokki.addEventListener("popup_unload",unload);pokki.addEventListener("popup_hidden",hidden);pokki.addEventListener("popup_shown",shown);var unloaded=new LocalStore("unloaded"),splash_ran=unloaded.get()?!0:!1;
function load(){console.log("Popup page is loaded.");DbManager.initialise();FeedViewer.initialise();modes.initialise();pokki.resetContextMenu();window.localStorage.getItem("isSyncOn")||window.localStorage.setItem("isSyncOn","false");IS_SYNC_ON=window.localStorage.getItem("isSyncOn");"true"==IS_SYNC_ON?(setInterval(function(){Reader.syncSubscriptions()},12E4),addContextMenu(),continueLocal()):($("#loadercontainer").find("h3").hide(0),$("#loadercontainer").find("a").css("display","inline"))}
function unload(){unloaded.set(!0);console.log("Popup page is being unloaded.")}function showing(){console.log("Popup window is almost visible.")}pokki.addEventListener("popup_showing",showing);function shown(){setTimeout(function(){},1E3);console.log("Popup window is visible.")}function hidden(){console.log("Popup window was hidden.")};
