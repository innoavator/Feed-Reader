/* This file contains the database functions for the WebDatabase manager in HTML5.
 * It stores the read feeds item tags the subscriptions of the user *
 */
var DbManager = {
	db : null,
	initialise : function(){
		/* Create the p3Reader database if it does not exist.*/
		this.db = openDatabase('p3reader',"1.0","Subscriptions Database",1024*200);
		/* Create the subscriptions table if it does not exist */
		this.db.transaction(function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS subscriptions(id text PRIMARY KEY, htmlUrl text, title text,label text,unreadCount integer,timestamp DATETIME)',[],function(){
							console.log("Table created successfully.");
						},function(e){
							console.log(e);
						});
		});

		/* Create the tags table if it does not exist */
		this.db.transaction(function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS tags(id text,item text PRIMARY KEY,tag text,timestamp DATETIME)',[],function(){
							console.log("Table created successfully.");
						},function(e){
							console.log(e);
						});
		});
	},
	openDb : function()
	{
		this.db = openDatabase('p3reader',"1.0","Subscriptions Database",1024*200);
	},
	/* Insert a new Subscription into the subscripitions table */	
	insertSubscription : function(id,url,title,label)
	{
		this.db.transaction(function(tx){
			tx.executeSql('INSERT INTO subscriptions(id,htmlUrl,title,label,unreadCount,timestamp) VALUES (?,?,?,?,0,?)',[id,url,title,label,new Date()],
							function(tx,r){
								console.log("Successfully inserted : " + id);
							},function(tx,e){
								console.log("Error inserting items : " + e.message);
							});
		
		});
	},

	/* Delete an existing subscription from the subscription table*/
	removeSubscription : function(feedId,callback)
	{
		this.db.transaction(function(tx){
			tx.executeSql("DELETE FROM subscriptions WHERE id = ?",[feedId],function(tx,r){
					console.log("Successfully removed : " + feedId);
					callback();
				},function(tx, e){
					console.log("Error deleting subscriptions : " + e);
				});
		});
	},
	
	/* Insert a tag fseor an item of a feed
	 *	@param feedUrl : The url of the feed to which the item belongs
	 *	@param : The id of the item
	 *	@param : tag to be applied to the item(read/kept-unread/like/dislike)
	 * */
	insertTag : function(feedId,itemId,tag)
	{
		this.db.transactiohn(function(tx){
			tx.executeSql('INSERT INTO tags(id,item,tag,timestamp) VALUES (?,?,?,?)',[feedId,itemId,tag,new Date()],
							function(tx,r){
								console.log("Successfully inserted items.");
							},function(tx,e){
								console.log("Error inserting items : " + e.message);
							});
		
		});
	},
	
	getSubscriptions : function(callback)
	{
		this.db.transaction(function(tx){
			tx.executeSql("SELECT * FROM subscriptions",[],function(tx,results){
					var len = results.rows.length,i;
					var feedArray = new Array(len);
					for(i = 0;i<len;i++) {
						feedArray[i] = new Object();
						feedArray[i].url = results.rows.item(i).id;
						feedArray[i].title = results.rows.item(i).title;
						feedArray[i].label = results.rows.item(i).label;
						feedArray[i].unreadCount = results.rows.item(i).unreadCount;
					}
					callback(feedArray);
				});
		});
	},
	getSubscriptionIds : function(callback)
	{
		this.db.transaction(function(tx){
			tx.executeSql("SELECT id FROM subscriptions",[],function(tx,results){
					console.log(results.rows);
					var len = results.rows.length,i;
					var subsList = new Array(len);
					for(i = 0;i<len;i++) 
						subsList[i] = results.rows.item(i).id;
					if(callback)
						callback(subsList);
				});
		});
	},
	/* Check if a feed is already subcribed or not*/
	checkSubscription : function(feedId,callback)
	{
		this.db.transaction(function(tx){
			tx.executeSql("SELECT * FROM subscriptions WHERE id=?",[feedId],function(tx,results){
				if(callback)
					callback(results.rows.length);
			},function(tx,e){
				console.log("Error checking subscription : " + e.message);
			});
		});
	},
	
	/* Get The unread Count of a FeedSource*/
	getUnreadCount : function(feedId,callback)
	{
		this.db.transaction(function(tx){
		tx.executeSql("SELECT unreadCount FROM subscriptions WHERE id=?",[feedId],function(tx,results){
				if(callback)
					callback(results.rows.item(0).unreadCount);
			}, function(tx,e){
				console.log("Error getting UnreadCount : " + e.message);
			});
		});
	},
	
	/* Update the unread count for a feedurl.*/
	updateUnreadCount : function(feedId,count)
	{
		this.db.transaction(function(tx){
			tx.executeSql('UPDATE subscriptions SET unreadCount=? WHERE id=?',[count,feedId],function(){
			});
		});
	},
	
	/* Get The Tag associated with an item */
	getItemTag : function(feedUrl,itemId,callback)
	{
		this.db.transaction(function(tx){
			tx.executeSql('SELECT tag FROM tags where item = ? AND id = ?',[itemId,feedUrl],function(tx,results){
			if(callback){
				if(results.rows.length ==0)
						callback(null);
					else 
						callback(results.rows.item(0).tag);
				}
			});
		});
	},
	
	/* Add Tag to A item*/
	insertItemTag : function(feedUrl,itemId,tag)
	{
		this.db.transaction(function(tx){
			console.log(feedUrl + "  : " + itemId + " : " + tag);
			tx.executeSql('INSERT INTO tags(id,item,tag,timestamp) VALUES(?,?,?,?)',[feedUrl,itemId,tag,new Date()],function(tx,results){
					console.log(" Item inserted successfully ");
				},function(tx,e){
					console.log(e);
					console.log("Error inserting tag : ");	
			});
		});
	},
	
	/* Update the tag of a feed item */
	updateItemTag : function(feedUrl,itemId,tag)
	{
		this.db.transaction(function(tx){
			tx.executeSql('UPDATE tags SET tag = ? WHERE id = ? AND item = ?',[tag,feedUrl,itemId],function(tx,r){
				console.log("Item tag updated successfully. ");
			},function(tx,e){
				console.log("Error updating tag : " + e);
			});
		});
	},
	
	/* Delete subscriptions and tags table */
	emptyDatabase : function(callback)
	{
		console.log("Dumping table...");
		this.db.transaction(function(tx){
			tx.executeSql('DELETE FROM subscriptions',[],function(){
				if(callback) callback();
			});
			tx.executeSql('DELETE FROM tags',[],function(){
				console.log("Tags Table destroyed successfully");
			});
		});
	},
	
	/* Remove entries in the tags table older than two weeks */
	pruneDatabase : function()
	{
		var today = new Date();
		today.setTime(today.getTime()-129600000);
		console.log(today);
		//console.log(today);
		console.log("Pruning database.");
		this.db.transaction(function(tx){
			tx.executeSql('DELETE FROM tags WHERE timestamp < ?',[(today)],function(tx,r){
				console.log(r.rowsAffected);
			},function(tx,e){
				console.log("Error pruning database.");
			});
		});
	},

	syncWithLocalStorage : function()
	{
		var myFeedsList = new LocalStore('myFeeds');
		if(myFeedsList == null)
		{
			console.log("No Local Storage present.");
			return;
		}
		var list = myFeedsList.get();
		var feed = null;
		var feedinfo;
		if(list!=null)
		{
			var feeds = list.split(",");
			for(var i = 0;i<list.length;i++)
			{
				var feed = new LocalStore(feedinfo.id);
				var feedinfo = JSON.parse(feed.get());
				if(feedinfo != null)
					DbManager.insertSubscription(list[i],feedinfo.link,feedinfo.title,null);
				feed.remove();
			}
		}
		myFeedsList.remove();
	}
}
