// JavaScript Document

var subscriptionTimer;
var inSubscriptionState = false;
var loadingFinished = true;
var fetchTimer;
var inFetchingState = false;
var STACK_SIZE = 2000;
var SHOWALL = 1;
var SHOWUNREAD  = 0;
var NO_OF_FEEDS=20;

/* Google Reader Feed URLS */
var	GOOGLE_READER_URL = "http://www.google.com/reader/";
var	GOOGLE_READER_API_URL = GOOGLE_READER_URL+ "api/0/";
var	SUBSCRIPTION_LIST_URL = GOOGLE_READER_API_URL + "subscription/list";
var	TAG_LIST_URL = GOOGLE_READER_API_URL + "tag/list";

