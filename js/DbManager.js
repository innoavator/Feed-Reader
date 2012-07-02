/* This file contains the database functions for the WebDatabase manager in HTML5.
 * It stores the read feeds item tags the subscriptions of the user *
 */
var DbManager = {
	db : null,
	initialise : function(){
		/* Create the p3Reader database if it does not exist.*/
		this.db = openDatabase('db_p3reader',"1.0","Subscriptions Database",1024*200,function(data){
						console.log("Database created successfully");
						console.log(data);
				});
		console.log(this.db);
		
		/* Create the subscriptions table if it does not exist */
		this.db.transaction(function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS subscriptions(url text PRIMARY KEY,title text,label text,unreadCount integer,timestamp DATETIME)',[],function(){
							console.log("Table created successfully.");
						},function(e){
							console.log(e);
						});
		});

		/* Create the tags table if it does not exist */
		this.db.transaction(function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS tags(url text,item text PRIMARY KEY,tag text,timestamp DATETIME)',[],function(){
							console.log("Table created successfully.");
						},function(e){
							console.log(e);
						});
		});
	},
	
	/* Insert a new Subscription into the subscripitions table */	
	insertSubscription : function(url,title,label)
	{
		this.db.transaction(function(tx){
			tx.executeSql('INSERT INTO subscriptions(url,title,label,unreadCount,timestamp) VALUES (?,?,?,0,?)',[url,title,label,new Date()],
							function(tx,r){
								console.log("Successfully inserted items.");
							},function(tx,e){
								console.log("Error inserting items : " + e.message);
							});
		
		});
	},

	/* Delete an existing subscription from the subscription table*/
	removeSubscription : function(url)
	{
		console.log("Removing subscriptions..." + url);
		this.db.transaction(function(tx){
			tx.executeSql("DELETE FROM subscriptions WHERE url = ?",[url],function(tx,r){
					console.log("Successfully deleted subscripitions");
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
	insertTag : function(feedUrl,itemId,tag)
	{
		this.db.transactiohn(function(tx){
			tx.executeSql('INSERT INTO tags(url,item,tag,timestamp) VALUES (?,?,?,?)',[feedUrl,itemId,tag,new Date()],
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
						feedArray[i].url = results.rows.item(i).url;
						feedArray[i].title = results.rows.item(i).title;
						feedArray[i].label = results.rows.item(i).label;
						feedArray[i].unreadCount = results.rows.item(i).unreadCount;
						//console.log(results.rows.item(i).url);
						//console.log(results.rows.item(i).label);
						//console.log(results.rows.item(i).timestamp);
					}
					callback(feedArray);
				});
		});
	},
	
	/* Check if a feed is already subcribed or not*/
	isSubscribed : function(url,callback)
	{
	
	},
	
	/* Delete subscriptions and tags table */
	emptyDatabase : function()
	{
		console.log("Dumping table...");
		this.db.transaction(function(tx){
			tx.executeSql('DROP TABLE subscriptions',[],function(){
				console.log("Subscriptions Table destroyed successfully");
			});
			tx.executeSql('DROP TABLE tags',[],function(){
				console.log("Tags Table destroyed successfully");
			});
		});
	} 
}
