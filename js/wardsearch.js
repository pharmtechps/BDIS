//=================================================================
//                     MAIN FUNCTIONS - START                          
//=================================================================

function show_more_wards()
{
	var sw = $("div#ward_search_window")[0];
	$(sw).children().remove("pre.refreshable");
	
	if ((Object.keys(sw.wardlist).length === 0) || (sw.wardlist[sw.wardcount] == null))
	{
		showUserMessage("NO MATCH FOUND");
		$("#ward_search").val("");
		$("#ward_search")[0].focus();
	}
	else
	{
		var resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Seq. No.     Ward Name";
		$(sw).append(resultline);
		
		do
		{
			resultline = document.createElement("pre");
			$(resultline).addClass("refreshable");
			resultline.innerHTML = ("    " + sw.wardcount + "          ").substring(0, 14) + sw.wardlist[sw.wardcount].wardname;
			$(sw).append(resultline);
			sw.wardcount++;
		} 
		while (((sw.wardcount-1)%10!=0) && (sw.wardlist[sw.wardcount]!=null));
		
		resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Please enter sequence number (or 'N' if not shown) [<input id=\"ward_search_selection\" maxlength=\"2\">]";
		$(sw).append(resultline);
		
		$("#ward_search_selection")[0].focus();
		$("#ward_search_selection").bind("keypress", ward_search_selection_keypress);
	}
}

function show_ward_search(originInput)
{
	var sw = document.createElement("div");
	$(sw).addClass("popupWindow");
	$(sw).attr("id", "ward_search_window");
	sw.originInput = originInput;
	
	var tmpPre = document.createElement("pre");
	tmpPre.innerHTML = "\n\n Ward name: [<input id=\"ward_search\" maxlength=\"20\">]";
	$(sw).append(tmpPre);
	$("body").append(sw);
	$("#ward_search").bind("keypress", ward_search_keypress);
	$("#ward_search")[0].focus();
}

//=================================================================
//                       MAIN FUNCTIONS - END                        
//=================================================================



//=================================================================
//                  MAIN KEY PRESS EVENTS - START
//=================================================================

function ward_search_keypress(e)
{
	var sw = $("div#ward_search_window")[0];
	if (e.which == 13)
	{
		var tmpVal = $("#ward_search").val();
		if (tmpVal == "^")
		{
			$(sw).remove();
			sw.originInput.focus();
		}
		else
		{
			var transaction = pimsDB.transaction("wards");
			var objectStore = transaction.objectStore("wards");
			var range = IDBKeyRange.bound(tmpVal, tmpVal + "z");
			var index = objectStore.index("wardname");
			var request = index.openCursor(range);
			var wardList = {};
			var seq = 1;
			
			request.onsuccess = function(e)
			{
				var cursor = e.target.result;
				if (cursor)
				{
					wardList[seq++] = cursor.value;
					cursor.continue();
				}
				else
				{
					sw.wardlist = wardList;
					sw.wardcount = 1;
					show_more_wards();
				}
			};	
		}
	}
}

function ward_search_selection_keypress(e)
{
	if (e.which == 13)
	{
		var wardselection = $("#ward_search_selection").val();
		var sw = $("div#ward_search_window")[0];
		
		if (wardselection == "N")
		{
			show_more_wards();
		}
		else
		{
			if (sw.wardlist[wardselection] == null)
			{
				showUserMessage("NO MATCH FOUND");
				$("#ward_search_selection").val("");
				$("#ward_search_selection")[0].focus();
			}
			else
			{
				$(sw).remove();
				var ward = sw.wardlist[wardselection];
				sw.originInput.value = ward.wardcode;
				sw.originInput.focus();
				
				var tmpEvent = jQuery.Event("keypress");
				tmpEvent.which = 13;
				$(sw.originInput).trigger(tmpEvent);
			}
		}
	}
}

//=================================================================
//                   MAIN KEY PRESS EVENTS - END
//=================================================================