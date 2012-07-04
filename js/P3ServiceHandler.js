/* This file implements the Thrift functions. It sends data to the P3ClientBackend to be sent to the middleware and also fetches recommendations 
 * from the middleware. 
 */
 
 var P3ServiceHandler = {
    
    transport : null,
    protocol : null,
    client : null,
    appId : null,
    appSecret : null,    
    initialise : function(appId,appSecret)
    {
        this.transport = new Thrift.Transport("http://localhost:8088/");
        this.protocol  = new Thrift.Protocol(P3ServiceHandler.transport);
        this.client    = new P3ClientServiceClient(P3ServiceHandler.protocol);
        this.appId = appId;
        this.appSecret = appSecret;
    },
    
    sendSubscriptionData : function(feedId,isSubscribing)
    {
        var key = feedId;
        if(isSubscribing == true)
            var value = "1";
        else
            var value = "-1";
        this.sendProfileData("feedsource",key,value);
    },
    
    sendTagData : function(feedId,itemId,tag)
    {
        var key = feedId + ","+itemId;
        var value = "0";
        switch(tag){
            case "read" : value ="0"; break;
            case "kept-unread" : value = "2"; break;
            case "like" : value="5"; break;
            case "dislike" : value="-5"; break; 
        }
        this.sendProfileData("feeditem",key,value);
    },
    
    sendProfileData : function(profilegroup,key,value)
    {
        console.log("Sending data over thrift");
        var dataArr = new Array(1);
        var data = new Data();
        data.key = key;    
        data.value = value;
        dataArr[0] = data;
        console.log(dataArr);
        try{
            result = P3ServiceHandler.client.sendData(dataArr, profilegroup, P3ServiceHandler.appSecret);
            console.log(result);
        }catch(err){
            console.log("Error sending data to thrift server");
            console.log(err.message);
        }
    }   
 }
 
