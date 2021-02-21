//=================================================================
//                     MAIN FUNCTIONS - START                          
//=================================================================

function show_more_prescribers()
{
	var sw = $("div#prescriber_specialty_search_window")[0];
	$(sw).children().remove("pre.refreshable");
	
	if ((Object.keys(sw.prescriberlist).length === 0) || (sw.prescriberlist[sw.prescribercount] == null))
	{
		showUserMessage("NO MATCH FOUND");
		$("#prescriber_search").val("");
		$("#prescriber_search")[0].focus();
	}
	else
	{
		var resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Seq. No.     Prescriber Name";
		$(sw).append(resultline);
		
		do
		{
			resultline = document.createElement("pre");
			$(resultline).addClass("refreshable");
			resultline.innerHTML = ("    " + sw.prescribercount + "          ").substring(0, 14) + sw.prescriberlist[sw.prescribercount].prescribername;
			$(sw).append(resultline);
			sw.prescribercount++;
		} 
		while (((sw.prescribercount-1)%10!=0) && (sw.prescriberlist[sw.prescribercount]!=null));
		
		resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Please enter sequence number (or 'N' if not shown) [<input id=\"prescriber_search_selection\" maxlength=\"3\">]";
		$(sw).append(resultline);
		
		$("#prescriber_search_selection")[0].focus();
		$("#prescriber_search_selection").bind("keypress", prescriber_search_selection_keypress);
	}
}

function show_more_specialties()
{
	var sw = $("div#prescriber_specialty_search_window")[0];
	$(sw).children().remove("pre.refreshable");
	
	if ((Object.keys(sw.specialtylist).length === 0) || (sw.specialtylist[sw.specialtycount] == null))
	{
		showUserMessage("NO MATCH FOUND");
		$("#specialty_search").val("");
		$("#specialty_search")[0].focus();
	}
	else
	{
		var resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Seq. No.     Specialty Name";
		$(sw).append(resultline);
		
		do
		{
			resultline = document.createElement("pre");
			$(resultline).addClass("refreshable");
			resultline.innerHTML = ("    " + sw.specialtycount + "          ").substring(0, 14) + sw.specialtylist[sw.specialtycount].specialtyname;
			$(sw).append(resultline);
			sw.specialtycount++;
		} 
		while (((sw.specialtycount-1)%10!=0) && (sw.specialtylist[sw.specialtycount]!=null));
		
		resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Please enter sequence number (or 'N' if not shown) [<input id=\"specialty_search_selection\" maxlength=\"2\">]";
		$(sw).append(resultline);
		
		$("#specialty_search_selection")[0].focus();
		$("#specialty_search_selection").bind("keypress", specialty_search_selection_keypress);
	}
}

function show_prescriber_specialty_search(originInput, doPrescriber, doSpecialty)
{
	var sw = document.createElement("div");
	$(sw).addClass("popupWindow");
	$(sw).attr("id", "prescriber_specialty_search_window");
	sw.originInput = originInput;
	
	if (doPrescriber && doSpecialty)
	{
		var tmpPre = document.createElement("pre");
		tmpPre.innerHTML = "\n\n Prescriber or Specialty [P/S] [<input id=\"prescriber_or_specialty\" maxlength=\"1\">]";
		$(sw).append(tmpPre);
		$("body").append(sw);
		$("#prescriber_or_specialty").bind("keypress", prescriber_or_specialty_keypress);
		$("#prescriber_or_specialty")[0].focus();
	}
	else if (doPrescriber)
	{
		var tmpPre = document.createElement("pre");
		tmpPre.innerHTML = "\n\n Prescriber name: [<input id=\"prescriber_search\" maxlength=\"20\">]";
		$(sw).append(tmpPre);
		$("body").append(sw);
		$("#prescriber_search").bind("keypress", prescriber_search_keypress);
		$("#prescriber_search")[0].focus();
	}
	else
	{
		var tmpPre = document.createElement("pre");
		tmpPre.innerHTML = "\n\n Specialty name: [<input id=\"specialty_search\" maxlength=\"20\">]";
		$(sw).append(tmpPre);
		$("body").append(sw);
		$("#specialty_search").bind("keypress", specialty_search_keypress);
		$("#specialty_search")[0].focus();
	}
}

//=================================================================
//                       MAIN FUNCTIONS - END                        
//=================================================================



//=================================================================
//                  MAIN KEY PRESS EVENTS - START
//=================================================================

function prescriber_or_specialty_keypress(e)
{
	if (e.which == 13)
	{
		var sw = $("div#prescriber_specialty_search_window")[0];
		
		var PoS = $("#prescriber_or_specialty").val();
		$("#prescriber_or_specialty").val("");
		
		if (PoS == "^")
		{
			$(sw).remove();
			$(sw).originInput.focus();
		}
		else if (PoS == "P")
		{
			$(sw).remove();
			show_prescriber_specialty_search(sw.originInput, true, false);
		}
		else if (PoS = "S")
		{
			$(sw).remove();
			show_prescriber_specialty_search(sw.originInput, false, true);
		}
		else
		{
			$("#prescriber_or_specialty")[0].focus();
		}
	}
}

function prescriber_search_keypress(e)
{
	var sw = $("div#prescriber_specialty_search_window")[0];
	if (e.which == 13)
	{
		var tmpVal = $("#prescriber_search").val();
		if (tmpVal == "^")
		{
			$(sw).remove();
			sw.originInput.focus();
		}
		else
		{
			var transaction = pimsDB.transaction("prescribers");
			var objectStore = transaction.objectStore("prescribers");
			var range = IDBKeyRange.bound(tmpVal, tmpVal + "z");
			var index = objectStore.index("prescribername");
			var request = index.openCursor(range);
			var prescriberList = {};
			var seq = 1;
			
			request.onsuccess = function(e)
			{
				var cursor = e.target.result;
				if (cursor)
				{
					prescriberList[seq++] = cursor.value;
					cursor.continue();
				}
				else
				{
					sw.prescriberlist = prescriberList;
					sw.prescribercount = 1;
					show_more_prescribers();
				}
			};	
		}
	}
}

function specialty_search_keypress(e)
{
	var sw = $("div#prescriber_specialty_search_window")[0];
	if (e.which == 13)
	{
		var tmpVal = $("#specialty_search").val();
		if (tmpVal == "^")
		{
			$(sw).remove();
			sw.originInput.focus();
		}
		else
		{
			var transaction = pimsDB.transaction("specialties");
			var objectStore = transaction.objectStore("specialties");
			var range = IDBKeyRange.bound(tmpVal, tmpVal + "z");
			var index = objectStore.index("specialtyname");
			var request = index.openCursor(range);
			var specialtyList = {};
			var seq = 1;
			
			request.onsuccess = function(e)
			{
				var cursor = e.target.result;
				if (cursor)
				{
					specialtyList[seq++] = cursor.value;
					cursor.continue();
				}
				else
				{
					sw.specialtylist = specialtyList;
					sw.specialtycount = 1;
					show_more_specialties();
				}
			};	
		}
	}
}

function prescriber_search_selection_keypress(e)
{
	if (e.which == 13)
	{
		var prescriberselection = $("#prescriber_search_selection").val();
		var sw = $("div#prescriber_specialty_search_window")[0];
		
		if (prescriberselection == "N")
		{
			show_more_prescribers();
		}
		else
		{
			if (sw.prescriberlist[prescriberselection] == null)
			{
				showUserMessage("NO MATCH FOUND");
				$("#prescriber_search_selection").val("");
				$("#prescriber_search_selection")[0].focus();
			}
			else
			{
				$(sw).remove();
				var prescriber = sw.prescriberlist[prescriberselection];
				sw.originInput.value = prescriber.prescribercode;
				sw.originInput.focus();
				
				var tmpEvent = jQuery.Event("keypress");
				tmpEvent.which = 13;
				$(sw.originInput).trigger(tmpEvent);
			}
		}
	}
}

function specialty_search_selection_keypress(e)
{
	if (e.which == 13)
	{
		var specialtyselection = $("#specialty_search_selection").val();
		var sw = $("div#prescriber_specialty_search_window")[0];
		
		if (specialtyselection == "N")
		{
			show_more_specialties();
		}
		else
		{
			if (sw.specialtylist[specialtyselection] == null)
			{
				showUserMessage("NO MATCH FOUND");
				$("#specialty_search_selection").val("");
				$("#specialty_search_selection")[0].focus();
			}
			else
			{
				$(sw).remove();
				var specialty = sw.specialtylist[specialtyselection];
				sw.originInput.value = specialty.specialtycode;
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