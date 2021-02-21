var jsonData = new Object();
var pimsDB;

function initDatabase()
{
	//                                     YYYYMMDDHHMM
	var request = indexedDB.open("pimsDB", 201905210300);
	
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
		showUserMessage("UPDATING DB");
		pimsDB = this.result;
		upgradeDatabase(e.target.result);
	}
	
	request.onerror = function(e)
	{
		console.log("Failed to create and open pimsDB");	
	}
}

function populateJsonObject(dataname)
{
	var request = $.ajax({type: "GET", url: "data/" + dataname + ".js", async: false}).responseText;
	jsonData[dataname] = jQuery.parseJSON(request);
}

function deleteObjectStore(objectStoreName)
{
	if(pimsDB.objectStoreNames.contains(objectStoreName))
	{
		pimsDB.deleteObjectStore(objectStoreName);
	}
}

function createObjectStore(objectStoreName, keys)
{
	var tmpObjectStore = pimsDB.createObjectStore(objectStoreName, keys);
	for (var i in jsonData[objectStoreName])
	{
		var request = tmpObjectStore.add(jsonData[objectStoreName][i]);
		request.onerror = function(e)
		{
			alert("Error adding " + e.target.result);	
		}
	}
	return tmpObjectStore;
}

function upgradeDatabase(pimsDB)
{
	// ---------------------------------- GET RAW DATA --------------------------------
	populateJsonObject("users");
	populateJsonObject("locations");
	populateJsonObject("drugs");
	populateJsonObject("directions");
	populateJsonObject("itemdirections");
	populateJsonObject("itembnfdirections");
	populateJsonObject("approvedNames");
	populateJsonObject("popCodes");
	populateJsonObject("prescribers");
	populateJsonObject("wards");
	populateJsonObject("specialties");
	
	// ----------------------------- DELETE OBJECT STORES -----------------------------
	deleteObjectStore("users");
	deleteObjectStore("locations");
	deleteObjectStore("drugs");
	deleteObjectStore("directions");
    deleteObjectStore("itemdirections");
	deleteObjectStore("itembnfdirections");
	deleteObjectStore("approvedNames");
	deleteObjectStore("popCodes");
	deleteObjectStore("prescribers");
	deleteObjectStore("wards");
	deleteObjectStore("specialties");
	
	// ----------------------------- CREATE OBJECT STORES -----------------------------
	createObjectStore("users", {keyPath: "password"});
	createObjectStore("locations", {keyPath: "locationcode"});
	createObjectStore("directions", {keyPath: "directionCode"});
	createObjectStore("popCodes", {keyPath: "popcode"});
	var osDrugs = createObjectStore("drugs", {keyPath: "itemnumber"});
	var osItemDirections = createObjectStore("itemDirections", {keyPath: ["locationcode", "itemnumber", "directionCode"]});
	var osItemBnfDirections = createObjectStore("itemBnfDirections", {keyPath: ["itemnumber", "directionCode"]});
	var osApprovedNames = createObjectStore("approvedNames", {keyPath: ["drugid", "drugname"]});
	var osPrescribers = createObjectStore("prescribers", {keyPath: "prescribercode"});
	var osWards = createObjectStore("wards", {keyPath: "wardcode"});
	var osSpecialities = createObjectStore("specialties", {keyPath: "specialtycode"});
	
	// -------------------------------- CREATE INDEXES -------------------------------
	osDrugs.createIndex("name", "name", {unique: false});
	osDrugs.createIndex("drugid", "drugid", {unique: false});
	osItemDirections.createIndex("locationItemNumber", ["locationcode", "itemnumber"], {unique: false});
	osItemBnfDirections.createIndex("itemnumber", "itemnumber", {unique: false});
	osApprovedNames.createIndex("drugname", "drugname", {unique: false});
	osPrescribers.createIndex("prescribername", "prescribername", {unique: false});
	osWards.createIndex("wardname", "wardname", {unique: false});
	osSpecialities.createIndex("specialtyname", "specialtyname", {unique: false});
	
	// -------------------------------- CLEAR RAW DATA --------------------------------
	jsonData = null;
}