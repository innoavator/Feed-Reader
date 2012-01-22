// JavaScript Document

var subscriptionTimer;
var inSubscriptionState = false;
var loadingFinished = true;
var fetchTimer;
var inFetchingState = false;
var STACK_SIZE = 2000;
var SHOWALL = 1;
var SHOWUNREAD  = 0;