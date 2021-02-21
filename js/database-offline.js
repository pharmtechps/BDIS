var pimsDB;

function initDatabase()
{
	var request = indexedDB.open("pimsDB");
	
	request.onsuccess = function(e)
	{
		showUserMessage("DB OPENED");
		pimsDB = this.result;
		console.log("database opened");
		
		if (location.href.indexOf("bdis-update.html") >= 0)
		{
			window.open('','_self','');
			window.close();
		}
	}
	
	request.onupgradeneeded = function(e)
	{
		showUserMessage("ERROR - UPGRADE NEEDED BUT APPLICATION IS RUNNING OFFLINE");
		pimsDB = this.result;
	}
	
	request.onerror = function(e)
	{
		showUserMessage("ERROR OPENING DATABASE");	
	}
}