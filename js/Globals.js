// JavaScript Document

var subscriptionTimer;
var inSubscriptionState = false;
var loadingFinished = true;
var fetchTimer;
var inFetchingState = false;
var STACK_SIZE = 2000;
var SHOWALL = 1;
var SHOWUNREAD  = 0;
var youtubeSuggestions = new Array();
/*	var availableTags = [
			"ActionScript",
			"AppleScript",
			"Asp",
			"BASIC",
			"C",
			"C++",
			"Clojure",
			"COBOL",
			"ColdFusion",
			"Erlang",
			"Fortran",
			"Groovy",
			"Haskell",
			"Java",
			"JavaScript",
			"Lisp",
			"Perl",
			"PHP",
			"Python",
			"Ruby",
			"Scala",
			"Scheme" ];*/