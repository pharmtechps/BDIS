//=================================================================
//                     MAIN FUNCTIONS - START                          
//=================================================================

function show_more_drugs()
{
	var sw = $("div#drug_search_window")[0];
	$(sw).children().remove("pre.refreshable");
	
	if ((Object.keys(sw.druglist).length === 0) || (sw.druglist[sw.drugcount] == null))
	{
		showUserMessage("NO MATCH FOUND");
		$("#drug_search").val("");
		$("#drug_search")[0].focus();
	}
	else
	{
		var resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Seq. No.     Drug Name";
		$(sw).append(resultline);
		
		do
		{
			resultline = document.createElement("pre");
			$(resultline).addClass("refreshable");
			resultline.innerHTML = ("    " + sw.drugcount + "          ").substring(0, 14) + sw.druglist[sw.drugcount].drugname;
			$(sw).append(resultline);
			sw.drugcount++;
		} 
		while (((sw.drugcount-1)%10!=0) && (sw.druglist[sw.drugcount]!=null));
		
		resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Please enter sequence number (or 'N' if not shown) [<input id=\"drug_search_selection\" maxlength=\"2\">]";
		$(sw).append(resultline);
		
		$("#drug_search_selection")[0].focus();
		$("#drug_search_selection").bind("keypress", drug_search_selection_keypress);
	}
}

function show_more_drugitems()
{
	var sw = $("div#drug_search_window")[0];
	$(sw).children().remove("pre.refreshable");
	
	if ((Object.keys(sw.drugitemlist).length === 0) || (sw.drugitemlist[sw.drugitemcount] == null))
	{
		showUserMessage("NO MATCH FOUND");
		sw.remove();
		show_drug_search(sw.originInput);
	}
	else
	{
		var resultline;
		do
		{
			var drug = sw.drugitemlist[sw.drugitemcount];
			resultline = document.createElement("pre");
			$(resultline).addClass("refreshable");
			resultline.innerText = (("  " + sw.drugitemcount + "    ").substring(0,7) + drug.form + " " + drug.strength + " Pack " + drug.packsize + " (" + drug.baseunit + ")                              ").substring(0, 62) + drug.itemnumber;
			$(sw).append(resultline);
			sw.drugitemcount++;
		} 
		while (((sw.drugitemcount-1)%10!=0) && (sw.drugitemlist[sw.drugitemcount]!=null));
		
		resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Please enter sequence number (or 'N' if not shown) [<input id=\"drugitem_search_selection\" maxlength=\"3\">]";
		$(sw).append(resultline);
		
		$("#drugitem_search_selection")[0].focus();
		$("#drugitem_search_selection").bind("keypress", drugitem_search_selection_keypress);
	}
}

function show_drug_search(originInput)
{
	var searchWindow = document.createElement("div");
	$(searchWindow).addClass("popupWindow");
	$(searchWindow).attr("id", "drug_search_window");
	searchWindow.originInput = originInput;
	
	var drugSearch = document.createElement("pre");
	drugSearch.innerHTML = "\n\n Drug identification [<input id=\"drug_search\" maxlength=\"39\">]";
	$(searchWindow).append(drugSearch);
	$("body").append(searchWindow);
	
	$("#drug_search").bind("keypress", drug_search_keypress);
	$("#drug_search")[0].focus();
}

function show_drug_search2(drugid, drugname)
{
	var sw = $("#drug_search_window")[0];
	$(sw).empty();
	sw.drugitemlist = {};
	sw.drugitemcount = 1;
	
	var seq = 1;
	
	var tmpPre = document.createElement("pre");
	tmpPre.innerText = "\n\n    Drug name : " + drugname + "\n\n Seq                                                          Item  \n\n";
	$(sw).append(tmpPre);
	
	var transaction = pimsDB.transaction("drugs");
	var objectStore = transaction.objectStore("drugs");
	var range = IDBKeyRange.bound(drugid, drugid);
	var index = objectStore.index("drugid");
	var request = index.openCursor(range);
	
	request.onsuccess = function(e)
	{
		var cursor = e.target.result;
		if (cursor)
		{
			sw.drugitemlist[seq] = cursor.value;
			seq++;
			cursor.continue();
		}
		else
		{
			if ((Object.keys(sw.drugitemlist).length === 0) || (sw.drugitemlist[sw.drugitemcount] == null))
			{
				
			}
			else
			{
				do
				{
					var drug = sw.drugitemlist[sw.drugitemcount];
					var tmpPre = document.createElement("pre");
					$(tmpPre).addClass("refreshable");
					tmpPre.innerText = (("  " + sw.drugitemcount + "    ").substring(0,7) + drug.form + " " + drug.strength + " Pack " + drug.packsize + " (" + drug.baseunit + ")                              ").substring(0, 62) + drug.itemnumber;
					$(sw).append(tmpPre);
					sw.drugitemcount++;
				}
				while (((sw.drugitemcount-1)%10!=0) && (sw.drugitemlist[sw.drugitemcount]!=null));
				
				var resultline = document.createElement("pre");
				$(resultline).addClass("refreshable");
				resultline.innerHTML = "\n Please enter sequence number (or 'N' if not shown) [<input id=\"drugitem_search_selection\" maxlength=\"3\">]";
				$(sw).append(resultline);
				$("#drugitem_search_selection").bind("keypress", drugitem_search_selection_keypress);
				$("#drugitem_search_selection")[0].focus();
			}
		}
	}
}

function search_for_drug(tmpValue, originField)
{
	search_by_itemnumber(tmpValue, originField);
}

function search_by_itemnumber(tmpValue, originField)
{
	var transaction = pimsDB.transaction("drugs");
	var objectStore = transaction.objectStore("drugs");
	var request = objectStore.get(tmpValue);
	request.onsuccess = function(e)
	{
		if (e.target.result == null)
		{
			search_by_popcode(tmpValue, originField);
		}
		else
		{
			var event = jQuery.Event("drugsearchcomplete", {'detail': e.target.result});
			$(originField).trigger(event);
		}
	}
}

function search_by_popcode(tmpValue, originField)
{
	var transaction = pimsDB.transaction("popCodes");
	var objectStore = transaction.objectStore("popCodes");
	var request = objectStore.get(tmpValue);
	request.onsuccess = function(e)
	{
		if (e.target.result == null)
		{
			search_by_shortcode(tmpValue, originField);
			//var event = new CustomEvent('drugsearchcomplete', { 'detail': null });
			//$(originField).trigger(event);
		}
		else
		{
			search_by_itemnumber(e.target.result.itemnumber, originField);
		}
	}
}

function search_by_shortcode(tmpValue, originInput)
{
	var regex = new RegExp("^([a-z]*)([0-9]*)([a-z]*)([0-9]*)$", "i");
	var m = regex.exec(tmpValue);
	
	var N = m[1];
	var S = m[2];
	var F = m[3];
	var P = m[4];
	
	if ((N=="") || (S=="") || (F==""))
	{
		showUserMessage("INVALID SHORT CUT CODE");
	}
	else
	{	
		var transaction = pimsDB.transaction("drugs");
		var objectStore = transaction.objectStore("drugs");
		
		var range = IDBKeyRange.bound(N , N+"z");
		var index = objectStore.index("name");
		var request = index.openCursor(range);
		
		var drugList = {};
		var seq = 1;
		
		request.onsuccess = function(e)
		{
			var cursor = e.target.result;
			if (cursor)
			{
				var d = cursor.value;
				if ((d.strength.substr(0, S.length) == S) && (d.form.substr(0, F.length) == F) && (d.packsize.substr(0, P.length) == P))
				{
					drugList[seq++] = cursor.value;
				}
				cursor.continue();
			}
			else
			{
				if (drugList.length == 0)
				{
					showUserMessage("NO MATCHING ITEM FOUND");
				}
				else
				{
					show_shortcut_search(originInput, drugList);
				}
			}
		};
	}
}

function show_shortcut_search(originInput, drugList)
{
	var sw = document.createElement("div");
	$(sw).addClass("popupWindow");
	$(sw).attr("id", "drug_search_window");
	sw.originInput = originInput;
	sw.druglist = drugList;
	sw.drugcount = 1;
	$("body").append(sw);
	show_more_shortcut_drugs();
}

function show_more_shortcut_drugs()
{
	var sw = $("div#drug_search_window")[0];
	$(sw).children().remove("pre.refreshable");
	
	if ((Object.keys(sw.druglist).length === 0) || (sw.druglist[sw.drugcount] == null))
	{
		showUserMessage("NO MATCH FOUND");
		$(sw).remove();
		$(sw.originInput).val("");
		$(sw.originInput)[0].focus();
	}
	else
	{
		var resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Seq. No.     Drug Name";
		$(sw).append(resultline);
		
		do
		{
			resultline = document.createElement("pre");
			$(resultline).addClass("refreshable");
			resultline.innerHTML = ("    " + sw.drugcount + "          ").substring(0, 14) + sw.druglist[sw.drugcount].name + " " + sw.druglist[sw.drugcount].strength + " x " + sw.druglist[sw.drugcount].packsize;
			$(sw).append(resultline);
			sw.drugcount++;
		} 
		while (((sw.drugcount-1)%10!=0) && (sw.druglist[sw.drugcount]!=null));
		
		resultline = document.createElement("pre");
		$(resultline).addClass("refreshable");
		resultline.innerHTML = "\n Please enter sequence number (or 'N' if not shown) [<input id=\"drug_shortcut_search_selection\" maxlength=\"3\">]";
		$(sw).append(resultline);
		
		$("#drug_shortcut_search_selection")[0].focus();
		$("#drug_shortcut_search_selection").bind("keypress", drug_shortcut_search_selection_keypress);
	}
}

//=================================================================
//                       MAIN FUNCTIONS - END                        
//=================================================================



//=================================================================
//                  MAIN KEY PRESS EVENTS - START
//=================================================================

function drug_search_selection_keypress(e)
{
	if (e.which == 13)
	{
		var drugselection = $("#drug_search_selection").val();
		var sw = $("div#drug_search_window")[0];
		
		if (drugselection == "N")
		{
			show_more_drugs();
		}
		else if (drugselection == "^")
		{
			$(sw).children().remove("pre.refreshable");
			showUserMessage("NO MATCH FOUND");
			$("#drug_search").val("");
			$("#drug_search")[0].focus();
		}
		else
		{
			if (sw.druglist[drugselection] == null)
			{
				showUserMessage("NO MATCH FOUND");
				$("#drug_search_selection").val("");
				$("#drug_search_selection")[0].focus();
			}
			else
			{
				var selectedDrug = sw.druglist[drugselection];
				show_drug_search2(selectedDrug.drugid, selectedDrug.drugname);
			}
		}
	}
}

function drugitem_search_selection_keypress(e)
{
	if (e.which == 13)
	{
		var drugitemselection = $("#drugitem_search_selection").val();
		var sw = $("div#drug_search_window")[0];
		
		if (drugitemselection == "N")
		{
			show_more_drugitems();
		}
		else
		{
			if (sw.drugitemlist[drugitemselection] == null)
			{
				showUserMessage("NO MATCH FOUND");
				$("#drugitem_search_selection").val("");
				$("#drugitem_search_selection")[0].focus();
			}
			else
			{
				sw.originInput.value = sw.drugitemlist[drugitemselection].itemnumber;
				sw.remove();
				sw.originInput.focus();
				
				var tmpEvent = jQuery.Event("keypress");
				tmpEvent.which = 13;
				$(sw.originInput).trigger(tmpEvent);
			}
		}
	}
}

function drug_shortcut_search_selection_keypress(e)
{
	if (e.which == 13)
	{
		var drugshortcutselection = $("#drug_shortcut_search_selection").val();
		var sw = $("div#drug_search_window")[0];
		
		if (drugshortcutselection == "N")
		{
			show_more_shortcut_drugs();
		}
		else
		{
			if (sw.druglist[drugshortcutselection] == null)
			{
				showUserMessage("NO MATCH FOUND");
				$("#drug_shortcut_search_selection").val("");
				$("#drug_shortcut_search_selection")[0].focus();
			}
			else
			{
				sw.originInput.value = sw.druglist[drugshortcutselection].itemnumber;
				sw.remove();
				sw.originInput.focus();
				
				var tmpEvent = jQuery.Event("keypress");
				tmpEvent.which = 13;
				$(sw.originInput).trigger(tmpEvent);
			}
		}
	}
}

function drug_search_keypress(e)
{
	if (e.which == 13)
	{		
		if ($("#drug_search").val() == "^")
		{
			var sw = $("div#drug_search_window")[0];
			$(sw).remove();
			sw.originInput.value = "";
			sw.originInput.focus();
		}
		else
		{
			var druglist = {};
			var seq = 1;
			var drugname = $("#drug_search").val();
			var transaction = pimsDB.transaction("approvedNames");
			var objectStore = transaction.objectStore("approvedNames");
			var range = IDBKeyRange.bound(drugname, drugname + "z");
			var index = objectStore.index("drugname");
			var request = index.openCursor(range);
			
			request.onsuccess = function(e)
			{
				var cursor = e.target.result;
				if (cursor)
				{
					druglist[seq] = cursor.value;
					seq++;
					cursor.continue();
				}
				else
				{
					var searchWindow = $("div#drug_search_window")[0];
					searchWindow.druglist = druglist;
					searchWindow.drugcount = 1;
					show_more_drugs();
				}
			};
		}
	}
}

//=================================================================
//                   MAIN KEY PRESS EVENTS - END
//=================================================================