var bdis_location_code;
var bdis_location_name;
var bdis_label_mode_iscode;

//=================================================================
//                     BDIS FUNCTIONS - START
//=================================================================

function init_bdis()
{
	$("body > div").css("display", "none");
	$("#bdis").css("display", "block");

	var userMsg = document.createElement("pre");
	userMsg.innerHTML = "\n          PLEASE SELECT A LOCATION:\n            CODE    NAME\n";
	$("#bdis").append(userMsg);

	var objectStore = pimsDB.transaction("locations").objectStore("locations");
	objectStore.openCursor().onsuccess = function(e)
	{
		var cursor = e.target.result;
		if (cursor)
		{
			var strOption = "             " + cursor.value.locationcode + "      ";
			strOption = strOption.substring(0, 20) + cursor.value.name;

			var usrOpt = document.createElement("pre");
			usrOpt.innerHTML = strOption;
			$("#bdis").append(usrOpt);

			cursor.continue();
		}
		else
		{
			var userPrompt = document.createElement("pre");
			userPrompt.innerHTML = "\n          ENTER A LOCATION CODE: ";

			var locationInput = document.createElement("input");
			locationInput.id = "bdis_location";
			$(locationInput).bind("keypress", bdis_location_keypress);
			$(userPrompt).append(locationInput);

			$("#bdis").append(userPrompt);
			locationInput.focus();
		}
	}
}

function bdis_show_options()
{
	var usrOpt;

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "\n\n\n";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "          1 - Individual dispensing";
	$("#bdis").append(usrOpt);
	// Free label form have removed the innerHTML element L-Free Format Label
	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "       ";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "\n";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "          Please enter your selection: ";

	var optionInput = document.createElement("input");
	optionInput.id = "bdis_option";
	$(optionInput).bind("keypress", bdis_option_keypress);
	$(usrOpt).append(optionInput);

	$("#bdis").append(usrOpt);
	optionInput.focus();
}



function init_bdis_opt1()
{
	hideUserMessage();
	$("#bdis *").remove();

	var usrOpt;

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "\n UCLH PIMS BDIS vsn 200202     IP/OP DISPENSING               " + day + "." + month + "." + year.substr(2, 2);
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "\n Issues from : " + (bdis_location_name + "                                        ").substr(0, 42) + "On : " + day + "." + month + "." + year.substr(2, 2);
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "\n Dispensing type: O or I  <input id=\"bdis_opt1_dispensingtype\" maxlength=\"10\" placeholder =\"O or I\" >         Ward: <input id=\"bdis_opt1_ward\" maxlength=\"15\" placeholder =\"e.g T1GY\"> <span id=\"bdis_opt1_wardname\"></span>";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = " Patient <input id=\"bdis_opt1_patient\" maxlength=\"25\" placeholder =\"Free Type\">  Presc:<input id=\"bdis_opt1_prescriber\" maxlength=\"4\" placeholder =\"PRE\"> <span id=\"bdis_opt1_prescribername\"></span>";
	$("#bdis").append(usrOpt);


	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = " Drug <input id=\"bdis_opt1_drug\" maxlength=\"27\"placeholder =\"type S for Search\">  </span>";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = "      <span id=\"bdis_opt1_drugname\"></span> <span id=\"bdis_opt1_drugform\"></span> <span id=\"bdis_opt1_baseunit\"></span>\n      <span id=\"bdis_opt1_mainbrand\"></span>\n      <span id=\"bdis_opt1_stock\"></span>";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = " Issue Qty <input id=\"bdis_opt1_issue\" maxlength=\"6\"> <span id=\"bdis_opt1_issueinfo\"></span>\n\n";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	usrOpt.innerHTML = " Batch <input id=\"bdis_opt1_batch\" maxlength=\"10\">                Expiry date <input id=\"bdis_opt1_expiry\" maxlength=\"8\">]\n\n";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	// NO BRAND SUPPORT
	//usrOpt.innerHTML = " Label name [<input id=\"bdis_opt1_labelname\" maxlength=\"1\">]";
	usrOpt.innerHTML = "";
	$("#bdis").append(usrOpt);

	usrOpt = document.createElement("pre");
	// NO BRAND SUPPORT
	//usrOpt.innerHTML = " 2nd name   [<input id=\"bdis_opt1_2ndname\" maxlength=\"2\">]";
	usrOpt.innerHTML = "";
	$("#bdis").append(usrOpt);

	$("#bdis_opt1_dispensingtype").bind("keypress", bdis_opt1_dispensingtype_keypress);
	$("#bdis_opt1_ward").bind("keypress", bdis_opt1_ward_keypress);
	$("#bdis_opt1_patient").bind("keypress", bdis_opt1_patient_keypress);
	$("#bdis_opt1_prescriber").bind("keypress", bdis_opt1_prescriber_keypress);
	$("#bdis_opt1_drug").bind("keypress", bdis_opt1_drug_keypress);
	$("#bdis_opt1_drug").bind("drugsearchcomplete", bdis_opt1_drug_drugsearchcomplete);
	$("#bdis_opt1_issue").bind("keypress", bdis_opt1_issue_keypress);
	$("#bdis_opt1_batch").bind("keypress", bdis_opt1_batch_keypress);
	$("#bdis_opt1_expiry").bind("keypress", bdis_opt1_expiry_keypress);
	$("#bdis_opt1_labelname").bind("keypress", bdis_opt1_labelname_keypress);
	$("#bdis_opt1_2ndname").bind("keypress", bdis_opt1_2ndname_keypress);

	$("#bdis_opt1_dispensingtype")[0].focus();
}

function showPasswordPrompt()
{
	$("#bdis_opt1_password").parent().remove();
	$("#passwordError").remove();
	var passwordInput = document.createElement("pre");
	passwordInput.innerHTML = "           Please enter your password [<input type=\"password\" id=\"bdis_opt1_password\" maxlength=\"15\">]";
	$(passwordInput).css("position", "fixed");
	$(passwordInput).css("bottom", "0px");
	$("#bdis").append(passwordInput);
	$("#bdis_opt1_password")[0].focus();
	$("#bdis_opt1_password").bind("keypress", bdis_opt1_password_keypress);
}

function bdis_show_label_screen()
{
	bdis_label_mode_iscode = true;

	var instructions = document.createElement("div");
	instructions.id = "bdis_opt1_instructions";
	$("#bdis").append(instructions);

	var tmpPre;

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = "Additional typing";
	$(instructions).append(tmpPre);

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = "  none";
	$(instructions).append(tmpPre);

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = " ";
	$(instructions).append(tmpPre);

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = "Supplementary label texts";
	$(instructions).append(tmpPre);

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = "  none";
	$(instructions).append(tmpPre);

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = " ";
	$(instructions).append(tmpPre);

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = "Label codes";
	tmpPre.id = "bdis_opt1_label_codes_title";
	$(instructions).append(tmpPre);

	tmpPre = document.createElement("pre");
	tmpPre.innerHTML = "BNF codes";
	tmpPre.id = "bdis_opt1_bnf_codes_title";
	$(instructions).append(tmpPre);

	var transaction = pimsDB.transaction("itemDirections");
	var objectStore = transaction.objectStore("itemDirections");
	var range = IDBKeyRange.bound([bdis_location_code, $("#bdis")[0].labelinfo.drug], [bdis_location_code, $("#bdis")[0].labelinfo.drug]);
	var index = objectStore.index("locationItemNumber");
	var request = index.openCursor(range);

	request.onsuccess = function(e)
	{
		var cursor = e.target.result;
		if (cursor)
		{
			tmpPre = document.createElement("pre");
			tmpPre.innerHTML = "  " + cursor.value.directionCode;
			$(tmpPre).insertBefore("#bdis_opt1_bnf_codes_title");
			cursor.continue();
		}
		else
		{
			tmpPre = document.createElement("pre");
			tmpPre.innerHTML = "\n";
			$(tmpPre).insertBefore("#bdis_opt1_bnf_codes_title");
		}
	}

	var transaction = pimsDB.transaction("itemBnfDirections");
	var objectStore = transaction.objectStore("itemBnfDirections");
	var range = IDBKeyRange.bound($("#bdis")[0].labelinfo.drug, $("#bdis")[0].labelinfo.drug);
	var index = objectStore.index("itemnumber");
	var request = index.openCursor(range);
	var removeBnfTitle = true;

	request.onsuccess = function(e)
	{
		var cursor = e.target.result;
		if (cursor)
		{
			removeBnfTitle = false;

			tmpPre = document.createElement("pre");
			tmpPre.innerHTML = "  " + cursor.value.directionCode;
			$(instructions).append(tmpPre);
			cursor.continue();
		}
		else
		{
			if (removeBnfTitle)
			{
				$("#bdis_opt1_bnf_codes_title").remove();
			}
		}
	};

	var labelholder = document.createElement("div");
	labelholder.id = "bdis_opt1_label_holder";
	$("#bdis").append(labelholder);

	for (var i = 0; i <= 10; i++)
	{
		var inputline = document.createElement("input");
		inputline.maxLength = 41;
		$(inputline).addClass("labelLine");
		$(inputline)[0].charsSinceLastEnter = "";
		$(inputline)[0].originalString = "";
		$(inputline).bind("keydown", bdis_opt1_label_line_keydown);
		$(inputline).bind("keypress", bdis_opt1_label_line_keypress);
		$(labelholder).append(inputline);
	}

	var drug;
	var transaction = pimsDB.transaction("drugs");
	var objectStore = transaction.objectStore("drugs");
	var request = objectStore.get($("#bdis")[0].labelinfo.drug);

	request.onsuccess = function(e)
	{
		drug = e.target.result;

		var inputArr = $("#bdis_opt1_label_holder input");
		var li = $("#bdis")[0].labelinfo;

		var i = 0;

		if (labelinfo["type"] == "OUTPATIENT")
		{
			inputArr[0].value =  " KEEP OUT OF REACH AND SIGHT OF CHILDREN ";
			var strDrugInfo = drug.name + " " + drug.strength + " " + drug.form;
			wrapText(inputArr, 2, 4, 40, strDrugInfo);
		}
		else if (labelinfo["type"] == "IN-PATIENT")
		{
			inputArr[0].value =  " STORE IN A LOCKED MEDICINE CUPBOARD ";
			wrapText(inputArr, 3, 3, 40, drug.name);
			wrapText(inputArr, 4, 4, 40, drug.form);
			wrapText(inputArr, 5, 5, 40, drug.strength);
		}

		// ---------- create patient line ----------
		var patientNameLine = li["patient"];
		var padding1 = parseInt((inputArr[9].maxLength - patientNameLine.length) / 2);
		while (padding1 > 0)
		{
			patientNameLine = " " + patientNameLine;
			padding1--;
		}
		while (patientNameLine.length < inputArr[9].maxLength)
		{
			patientNameLine = patientNameLine + " ";
		}
		patientNameLine = patientNameLine.replace(/^\s\s\s/, li["presc"]);
		patientNameLine = patientNameLine.replace(new RegExp("\\s{" + li["ward"].length + "}$", ""), li["ward"]);
		inputArr[9].value =  patientNameLine;
		// ---------- create patient line ----------


		// ---------- create formulation line ----------
		var formulationLine = li["issue"] + " " + li["baseunit"];
		var padding2 = parseInt((inputArr[10].maxLength - formulationLine.length) / 2);

		while (padding2 > 0)
		{
			formulationLine = " " + formulationLine;
			padding2--;
		}
		while (formulationLine.length < inputArr[10].maxLength)
		{
			formulationLine = formulationLine + " ";
		}

		var labelcode = userInitials + "." + bdis_location_code + "." + li["drug"];
		formulationLine = formulationLine.replace(/^\s{10}/, day + "/" + month  + "/" + year);
		formulationLine = formulationLine.replace(new RegExp("\\s{" + labelcode.length + "}$", ""), labelcode);
		inputArr[10].value = formulationLine;
		// ---------- create formulation line ----------

		$(inputArr[0]).unbind("keypress");
		$(inputArr[9]).unbind("keypress");
		$(inputArr[10]).unbind("keypress");

		showUserMessage("ENTER DIRECTIONS AS A CODE OR PRESS F9 FOR FREE TEXT");

		for (var i = 3; i <= 7; i++)
		{
			if (inputArr[i].value == "")
			{
				inputArr[i].focus();
				break;
			}
		}
	};

	var finishlabel = document.createElement("div");
	finishlabel.id = "bdis_opt1_finishlabel";
	$("#bdis").append(finishlabel);
}

function finishLabel()
{
	hideUserMessage();

	var inputArr = $("#bdis_opt1_label_holder input");
	var li = $("#bdis")[0].labelinfo;
	li["ln1"] = inputArr[0].value;
	li["ln2"] = inputArr[1].value;
	li["ln3"] = inputArr[2].value;
	li["ln4"] = inputArr[3].value;
	li["ln5"] = inputArr[4].value;
	li["ln6"] = inputArr[5].value;
	li["ln7"] = inputArr[6].value;
	li["ln8"] = inputArr[7].value;
	li["ln9"] = inputArr[8].value;
	li["ln10"] = inputArr[9].value;
	li["ln11"] = inputArr[10].value;

	$("#bdis_opt1_quantity_required_pre").remove();
	$("#bdis_opt1_finishedlabelprompt").remove();
	$("#bdis_opt1_print_bnf_pre").remove();

	var quanityRequiredPrompt = document.createElement("pre");
	quanityRequiredPrompt.id = "bdis_opt1_quantity_required_pre";
	quanityRequiredPrompt.innerHTML = "Please enter no. of labels required [<input id=\"bdis_opt1_quantity_required\" maxlength=\"2\">]";
	$("#bdis_opt1_finishlabel").append(quanityRequiredPrompt);
	$("#bdis_opt1_quantity_required")[0].focus();
	$("#bdis_opt1_quantity_required").bind("keypress", bdis_opt1_quantity_required_keypress);
}

function bdis_opt1_printbnf()
{
	var printBnfPrompt = document.createElement("pre");
	printBnfPrompt.id = "bdis_opt1_print_bnf_pre";
	printBnfPrompt.innerHTML = "Print BNF labels Y/N [<input id=\"bdis_opt1_print_bnf\" maxlength=\"1\">]";
	$("#bdis_opt1_finishlabel").append(printBnfPrompt);
	$("#bdis_opt1_print_bnf")[0].focus();
	$("#bdis_opt1_print_bnf").bind("keypress", bdis_opt1_print_bnf_keypress);
}

function bdis_opt1_finishlabelprompt()
{
	var finishedLabelPrompt = document.createElement("pre");
	finishedLabelPrompt.id = "bdis_opt1_finishedlabelprompt";
	finishedLabelPrompt.innerHTML = "TYPE &lt;CR&gt; TO CONTINUE - SPACE BAR TO REPRINT - 'B' FOR BAG LABEL <input id=\"bdis_opt1_finishedlabelinput\" maxlength=\"1\">";
	$("#bdis").append(finishedLabelPrompt);
	$("#bdis_opt1_finishedlabelinput")[0].focus();

	$("#bdis_opt1_finishedlabelinput").keypress
	(
		function(e)
		{
			e.preventDefault();
			if (e.which == 13)
			{
				reinit_bdis_opt1();
			}
			else if (e.which == 32)
			{
				$("#bdis_opt1_quantity_required").val("");
				$("#bdis_opt1_quantity_required")[0].focus();
				finishLabel();
			}
			else if (e.which == 66)
			{
				sendXmlToLabelPrinter(createBagLabelXML());
				reinit_bdis_opt1();
			}
		}
	);
}

function reinit_bdis_opt1()
{
	init_bdis_opt1();
	var tmpEvent = jQuery.Event("keypress");
	tmpEvent.which = 13

	var labelinfo = $("#bdis")[0].labelinfo;
	$("#bdis_opt1_dispensingtype").val(labelinfo["type"]);
	$("#bdis_opt1_dispensingtype").trigger(tmpEvent);
	$("#bdis_opt1_ward").val(labelinfo["ward"]);
	$("#bdis_opt1_ward").trigger(tmpEvent);
	$("#bdis_opt1_patient").val(labelinfo["patient"]);
	$("#bdis_opt1_prescriber").val(labelinfo["presc"]);
	$("#bdis_opt1_prescriber").trigger(tmpEvent);
	$("#bdis_opt1_drug")[0].focus();
}

function createLabelXML()
{
	var li = $("#bdis")[0].labelinfo;
	var templatename = "";

	if (labelinfo["type"] == "OUTPATIENT")
	{
		templatename = "pimsoutpatient";
	}
	else if (labelinfo["type"] == "IN-PATIENT")
	{
		templatename = "pimsinpatient";
	}
	else if (labelinfo["type"] == "STOCKLABEL")
	{
		templatename = "pimsstocklabel";
	}
	else
	{
		templatename = "pimsfreeformat";
	}

	if (li["batch"] != "") li["batch"] = "BN:" + li["batch"];
	if (li["expiry"] != "") li["expiry"] = "Do not use after: " + li["expiry"];

	var xmltemplate =
	"<label type=\"template\" templatename=\"" + templatename + "\">" +
	    "<printQuantity>" + li["printquantity"] + "</printQuantity>" +
	    	"<fields>" +
		"<ln1>" + escapeHTML(li["ln1"]) + "</ln1>" +
		"<ln2>" + escapeHTML(li["ln2"]) + "</ln2>" +
		"<ln3>" + escapeHTML(li["ln3"]) + "</ln3>" +
		"<ln4>" + escapeHTML(li["ln4"]) + "</ln4>" +
		"<ln5>" + escapeHTML(li["ln5"]) + "</ln5>" +
		"<ln6>" + escapeHTML(li["ln6"]) + "</ln6>" +
		"<ln7>" + escapeHTML(li["ln7"]) + "</ln7>" +
		"<ln8>" + escapeHTML(li["ln8"]) + "</ln8>" +
		"<ln9>" + escapeHTML(li["ln9"]) + "</ln9>" +
		"<ln10>" + escapeHTML(li["ln10"]) + "</ln10>" +
		"<ln11>" + escapeHTML(li["ln11"]) + "</ln11>" +
		"<batchNumber>" + escapeHTML(li["batch"]) + "</batchNumber>" +
		"<useBefore>" + escapeHTML(li["expiry"]) + "</useBefore>" +
		"<patientName>" + escapeHTML(li["patient"]) + "</patientName>" +
		"<doctorInitials>" + escapeHTML(li["presc"]) + "</doctorInitials>" +
		"<printedDate>" + new Date().toLocaleDateString("en-GB") + "</printedDate>" +
		"<wardID>" + escapeHTML(li["ward"]) + "</wardID>" +
		"<issueCode>" + escapeHTML(userInitials) + "." + escapeHTML(bdis_location_code) + "." + escapeHTML(li["drug"]) + "</issueCode>" +
		"<quantityForm>" + escapeHTML(li["issue"]) + " " + escapeHTML(li["baseunit"]) + "</quantityForm>" +
	    "</fields>" +
	"</label>";

	return xmltemplate;
}

function createBagLabelXML()
{
	var li = $("#bdis")[0].labelinfo;
	var templatename = "";

	templatename = "pimsbag";

	var xmltemplate =
	"<label type=\"template\" templatename=\"" + templatename + "\">" +
	    "<printQuantity>" + li["printquantity"] + "</printQuantity>" +
	    	"<fields>" +
				"<TTA_MEDICATION_FOR>" + "TTA MEDICATION FOR" + "</TTA_MEDICATION_FOR>" +
				"<SURNAME_NAME>" + escapeHTML(li["patient"]) + "</SURNAME_NAME>" +
				"<WARD_NAME>" + escapeHTML(li["wardname"]) + "</WARD_NAME>" +
				"<Date_Hospital_ID>" + day + "." + month + "." + year + "         HOSP#: BACKUPDISP" + "</Date_Hospital_ID>" +
	    "</fields>" +
	"</label>";

	return xmltemplate;
}

function createSupplementaryXML(arrInputs)
{
	var xmltemplate =
	"<label type=\"template\" templatename=\"pimssupplementary\">" +
		"<printQuantity>" + $("#bdis")[0].labelinfo["printquantity"] + "</printQuantity>" +
		"<fields>" +
			"<ln01>" + escapeHTML(arrInputs[0].value) + "</ln01>" +
			"<ln02>" + escapeHTML(arrInputs[1].value) + "</ln02>" +
			"<ln03>" + escapeHTML(arrInputs[2].value) + "</ln03>" +
			"<ln04>" + escapeHTML(arrInputs[3].value) + "</ln04>" +
			"<ln05>" + escapeHTML(arrInputs[4].value) + "</ln05>" +
			"<ln06>" + escapeHTML(arrInputs[5].value) + "</ln06>" +
			"<ln07>" + escapeHTML(arrInputs[6].value) + "</ln07>" +
			"<ln08>" + escapeHTML(arrInputs[7].value) + "</ln08>" +
			"<ln09>" + escapeHTML(arrInputs[8].value) + "</ln09>" +
			"<ln10>" + escapeHTML(arrInputs[9].value) + "</ln10>" +
			"<ln11>" + escapeHTML(arrInputs[10].value) + "</ln11>" +
		"</fields>" +
	"</label>";

	return xmltemplate;
}

function printSupplementaryLabels(itemnumber)
{
	var transaction = pimsDB.transaction("itemBnfDirections");
	var objectStore = transaction.objectStore("itemBnfDirections");
	var range = IDBKeyRange.bound(itemnumber, itemnumber);
	var index = objectStore.index("itemnumber");
	var request = index.openCursor(range);

	request.onsuccess = function(e)
	{
		var cursor = e.target.result;
		if (cursor)
		{
			var transaction2 = pimsDB.transaction("directions");
			var objectStore2 = transaction2.objectStore("directions");
			var request2 = objectStore2.get(cursor.value.directionCode);

			request2.onsuccess = function(e2)
			{
				if (e2.target.result)
				{
					var arrInputs = new Array();
					for (var i = 0; i < 11; i++) arrInputs.push(document.createElement("input"));
					wrapText(arrInputs, 0, 10, 40, e2.target.result.directionText);
					moveTextToBottom(arrInputs);
					sendXmlToLabelPrinter(createSupplementaryXML(arrInputs));
				}
			};
			cursor.continue();
		}
		else
		{
			//done
		}
	};
}

//=================================================================
//                       BDIS FUNCTIONS - END
//=================================================================



//=================================================================
//                  BDIS KEY PRESS EVENTS - START
//=================================================================

function bdis_location_keypress(e)
{
	if (e.which == 13)
	{
		$("#bdis_invalid_location").remove();
		var tmpVal = $("#bdis_location").val();
		$("#bdis_location").val("")

		if ((tmpVal == "^") || (tmpVal == "@C"))
		{
			$("#bdis *").remove();
			$("body > div").css("display", "none");
			initMenu();
		}
		else
		{
			var transaction = pimsDB.transaction("locations");
			var objectStore = transaction.objectStore("locations");
			var request = objectStore.get(parseInt(tmpVal));
			request.onsuccess = function(e)
			{
				if (e.target.result == null)
				{
					var userPrompt = document.createElement("pre");
					userPrompt.innerHTML = "INVALID OPTION";
					userPrompt.id = "bdis_invalid_location";
					$("#bdis").append(userPrompt);
				}
				else
				{
					$("#bdis *").remove();
					bdis_location_code = e.target.result.locationcode;
					bdis_location_name = e.target.result.name;
					bdis_show_options();
				}
			};
		}
	}
}

function bdis_option_keypress(e)
{
	if (e.which == 13)
	{
		$("#bdis_invalid_option").remove();
		var tmpVal = $("#bdis_option").val();
		$("#bdis_option").val("");

		switch(tmpVal)
		{
			case "^":
			case "@C":
				$("#bdis *").remove();
				$("body > div").css("display", "none");
				init_bdis();
				break;
			case "1":
				$("#bdis *").remove();
				init_bdis_opt1();
				break;
			case "L":
				break;
			default:
				var usrOpt = document.createElement("pre");
				usrOpt.innerHTML = "          INVALID OPTION";
				usrOpt.id = "bdis_invalid_option";
				$("#bdis").append(usrOpt);
				break;
		}
	}
}

function bdis_opt1_dispensingtype_keypress(e)
{
	if (e.which == 13)
	{
		var tmpVal = $("#bdis_opt1_dispensingtype").val();
		$("#bdis_opt1_dispensingtype").val("");
		$("#bdis_opt1_ward")[0].focus();

		switch(tmpVal)
		{
			case "^":
			case "@C":
				$("#bdis *").remove();
				bdis_show_options();
				break;
			case "I":
			case "IN-PATIENT":
				$("#bdis_opt1_dispensingtype").val("IN-PATIENT");
				break;
			case "O":
			case "OUTPATIENT":
				$("#bdis_opt1_dispensingtype").val("OUTPATIENT");
				break;
			case "S":
			case "STOCKLABEL":
				$("#bdis_opt1_dispensingtype").val("STOCKLABEL");
				break;
			default:
				$("#bdis_opt1_dispensingtype")[0].focus();
				break;
		}
	}
}

function bdis_opt1_ward_keypress(e)
{
	if (e.which == 13)
	{
		var wardCode = $("#bdis_opt1_ward").val();
		if (wardCode == "^")
		{
			$("#bdis_opt1_ward").val("");
			$("#bdis_opt1_dispensingtype").val("");
			$("#bdis_opt1_dispensingtype")[0].focus();
		}
		else if (wardCode == "@D")
		{
			$("#bdis_opt1_ward").val("");
			show_ward_search($("#bdis_opt1_ward")[0]);
		}
		else
		{
			var transaction = pimsDB.transaction("wards");
			var objectStore = transaction.objectStore("wards");
			var request = objectStore.get(wardCode);
			request.onsuccess = function(e)
			{
				if (e.target.result == null)
				{
					$("#bdis_opt1_wardname").text("");
					$("#bdis_opt1_ward").val("");
					$("#bdis_opt1_ward")[0].focus();
				}
				else
				{
					$("#bdis_opt1_wardname").text(e.target.result.wardname.substring(0,16));
					$("#bdis_opt1_patient")[0].focus();
				}
			};
		}
	}
}

function bdis_opt1_patient_keypress(e)
{
	if (e.which == 13)
	{
		if ($("#bdis_opt1_patient").val() == "^")
		{
			$("#bdis_opt1_patient").val("");
			$("#bdis_opt1_wardname").text("");
			$("#bdis_opt1_ward").val("");
			$("#bdis_opt1_ward")[0].focus();
		}
		else if ($("#bdis_opt1_patient").val() != "")
		{
			$("#bdis_opt1_prescriber")[0].focus();
		}
	}
}

function bdis_opt1_prescriber_keypress(e)
{
	if (e.which == 13)
	{
		var tmpVal = $("#bdis_opt1_prescriber").val();
		if (tmpVal == "^")
		{
			$("#bdis_opt1_prescriber").val("");
			$("#bdis_opt1_patient").val("");
			$("#bdis_opt1_patient")[0].focus();
		}
		else if (tmpVal == "@D")
		{
			$("#bdis_opt1_prescriber").val("");
			show_prescriber_specialty_search($("#bdis_opt1_prescriber")[0], true, true);
		}
		else
		{
			var transaction = pimsDB.transaction("prescribers");
			var objectStore = transaction.objectStore("prescribers");
			var request = objectStore.get(tmpVal);
			request.onsuccess = function(e)
			{
				if (e.target.result == null)
				{
					var transaction = pimsDB.transaction("specialties");
					var objectStore = transaction.objectStore("specialties");
					var request = objectStore.get(tmpVal);
					request.onsuccess = function(e)
					{
						if (e.target.result == null)
						{
							$("#bdis_opt1_prescribername").text("");
							$("#bdis_opt1_prescriber").val("");
							$("#bdis_opt1_prescriber")[0].focus();
							$("#bdis_opt1_specialty").text("");
						}
						else
						{
							$("#bdis_opt1_prescribername").text(e.target.result.specialtyname.substring(0,16));
							$("#bdis_opt1_specialty").text("");
							$("#bdis_opt1_drug")[0].focus();
						}
					}
				}
				else
				{
					$("#bdis_opt1_prescribername").text(e.target.result.prescribername.substring(0,16));
					$("#bdis_opt1_drug")[0].focus();

					var transaction = pimsDB.transaction("specialties");
					var objectStore = transaction.objectStore("specialties");
					var request = objectStore.get(e.target.result.specialtycode);
					request.onsuccess = function(e)
					{
						$("#bdis_opt1_specialty").text(e.target.result.specialtyname);
					};
				}
			};
		}
	}
}

function bdis_opt1_drug_keypress(e)
{
	if (e.which == 13)
	{
		hideUserMessage();

		var userValue = $("#bdis_opt1_drug").val();

		if (userValue == "^")
		{
			$("#bdis_opt1_drug").val("");
			$("#bdis_opt1_prescribername").text("");
			$("#bdis_opt1_prescriber").val("");
			$("#bdis_opt1_prescriber")[0].focus();
			$("#bdis_opt1_specialty").text("");
		}
		else if (userValue == "S")
		{
			show_drug_search($("#bdis_opt1_drug")[0]);
		}
		else
		{
			search_for_drug(userValue, $("#bdis_opt1_drug")[0]);
		}
	}
}

function bdis_opt1_drug_drugsearchcomplete(e)
{
	var drug = e.detail;
	$("#bdis_opt1_drug").val(drug.itemnumber);
	$("#bdis_opt1_drugname").text(drug.name + " " + drug.strength);
	$("#bdis_opt1_mainbrand").text("Main brand = " + drug.name);
	$("#bdis_opt1_stock").text("Current Stock Level = Unknown");
	$("#bdis_opt1_drugform").text(drug.form);
	$("#bdis_opt1_baseunit").text(drug.baseunit);
	if (drug.issueunit == "B")
	{
		$("#bdis_opt1_issue").val(drug.packsize);
		$("#bdis_opt1_issueinfo").text(drug.baseunit + "(s) from " + drug.packtype + " of " + drug.packsize);
	}
	else
	{
		$("#bdis_opt1_issue").val("1");
		$("#bdis_opt1_issueinfo").text(drug.packtype + "(s) of " + drug.packsize + " " + drug.baseunit + "s");
	}
	$("#bdis_opt1_issue")[0].focus();
}

function bdis_opt1_issue_keypress(e)
{
	if (e.which == 13)
	{
		var tmpVal = $("#bdis_opt1_issue").val();
		if (tmpVal == "^")
		{
			$("#bdis_opt1_issue").val("");
			$("#bdis_opt1_drug").val("");

			$("#bdis_opt1_drugname").text("");
			$("#bdis_opt1_drugform").text("");
			$("#bdis_opt1_baseunit").text("");
			$("#bdis_opt1_mainbrand").text("");
			$("#bdis_opt1_stock").text("");
			$("#bdis_opt1_issueinfo").text("");

			$("#bdis_opt1_drug")[0].focus();
		}
		else
		{
			if ($("#bdis_opt1_drug").val() != "") showPasswordPrompt();
		}
	}
}

function bdis_opt1_password_keypress(e)
{
	if (e.which == 13)
	{
		var tmpVal = $("#bdis_opt1_password").val();
		if (tmpVal == "^")
		{
			$("#bdis_opt1_password").parent().remove();
			$("#passwordError").remove();
			$("#bdis_opt1_2ndname").val("");
			// NO BRAND SUPPORT
			//$("#bdis_opt1_2ndname")[0].focus();
			$("#bdis_opt1_expiry").val("");
			$("#bdis_opt1_expiry")[0].focus();
		}
		else
		{
			var transaction = pimsDB.transaction("users");
			var objectStore = transaction.objectStore("users");
			var request = objectStore.get(tmpVal);
			request.onsuccess = function(e)
			{
				if (e.target.result == null)
				{
					$("#bdis_opt1_password").parent().remove();
					var passwordError = document.createElement("pre");
					passwordError.id = "passwordError";
					passwordError.innerHTML = "                     INCORRECT PASSWORD";
					$(passwordError).css("position", "fixed");
					$(passwordError).css("bottom", "0px");
					$("#bdis").append(passwordError);
					setTimeout(showPasswordPrompt, 1500);
				}
				else
				{
					labelinfo = new Object();
					labelinfo["type"] = $("#bdis_opt1_dispensingtype").val();
					labelinfo["ward"] = $("#bdis_opt1_ward").val();
					labelinfo["wardname"] = $("#bdis_opt1_wardname").text();
					labelinfo["patient"] = $("#bdis_opt1_patient").val();
					labelinfo["presc"] = $("#bdis_opt1_prescriber").val();
					labelinfo["drug"] = $("#bdis_opt1_drug").val();
					labelinfo["drugform"] = $("#bdis_opt1_drugform").text();
					labelinfo["baseunit"] = $("#bdis_opt1_baseunit").text();
					labelinfo["issue"] = $("#bdis_opt1_issue").val();
					labelinfo["batch"] = $("#bdis_opt1_batch").val();
					labelinfo["expiry"] = $("#bdis_opt1_expiry").val();
					labelinfo["labelname"] = $("#bdis_opt1_labelname").val();
					labelinfo["2ndname"] = $("#bdis_opt1_2ndname").val();
					$("#bdis *").remove();
					$("#bdis")[0].labelinfo = labelinfo;
					bdis_show_label_screen();
				}
			};
		}
	}
}

function bdis_opt1_batch_keypress(e)
{
	if (e.which == 13)
	{
		var tmpVal = $("#bdis_opt1_batch").val();
		if (tmpVal == "^")
		{
			$("#bdis_opt1_batch").val("");
			$("#bdis_opt1_issue").val("");
			$("#bdis_opt1_issue")[0].focus();
		}
		else
		{
			showPasswordPrompt();
		}
	}
}

function bdis_opt1_expiry_keypress(e)
{
	if (e.which == 13)
	{
		hideUserMessage();

		var tmpVal = $("#bdis_opt1_expiry").val();
		if (tmpVal == "^")
		{
			$("#bdis_opt1_expiry").val("");
			$("#bdis_opt1_batch").val("");
			$("#bdis_opt1_batch")[0].focus();
		}
		else
		{
			if (tmpVal == "")
			{
				showPasswordPrompt();
			}
			else
			{
				var tmpDate = null;
				var sd = tmpVal.split(".");

				if ((tmpVal.length == 8) && (sd.length == 3))
				{
					tmpDate = getDate(sd[0] + "/" + sd[1] + "/20" + sd[2]);
				}

				if (tmpDate != null)
				{
					var tmpNow = new Date();
					if (tmpDate >= tmpNow)
					{
						showPasswordPrompt();
					}
					else
					{
						$("#bdis_opt1_expiry").val("");
						$("#bdis_opt1_expiry")[0].focus();
						showUserMessage("EXPIRY DATE MUST BE IN THE FUTURE");
					}
				}
				else
				{
					$("#bdis_opt1_expiry").val("");
					$("#bdis_opt1_expiry")[0].focus();
					showUserMessage("DATE FORMAT MUST BE DD.MM.YYYY");
				}
			}
		}
	}
}

function bdis_opt1_labelname_keypress(e)
{
	if (e.which == 13)
	{
		var tmpVal = $("#bdis_opt1_labelname").val();
		if (tmpVal == "^")
		{
			$("#bdis_opt1_labelname").val("");
			$("#bdis_opt1_expiry").val("");
			$("#bdis_opt1_expiry")[0].focus();
		}
		else
		{
			showPasswordPrompt();
		}
	}
}

function bdis_opt1_2ndname_keypress(e)
{
	if (e.which == 13)
	{
		var tmpVal = $("#bdis_opt1_2ndname").val();
		if (tmpVal == "^")
		{
			$("#bdis_opt1_2ndname").val("");
			$("#bdis_opt1_labelname").val("");
			$("#bdis_opt1_labelname")[0].focus();
		}
		else
		{
			showPasswordPrompt();
		}
	}
}

function bdis_opt1_label_line_keypress(e)
{
	if (e.which == 13)
	{
		var tmpInputs = $("#bdis_opt1_label_holder input");
		var startLine = tmpInputs.index(e.target);
		var tmpVal = this.charsSinceLastEnter;
		this.value = this.originalString;
		this.charsSinceLastEnter = "";
		var transaction = pimsDB.transaction("directions");
		var objectStore = transaction.objectStore("directions");

		if (tmpVal != "")
		{
			var request = objectStore.get(tmpVal);
			request.onsuccess = function(e)
			{
				if (e.target.result == null)
				{
					showUserMessage("DIRECTION NOT FOUND");
				}
				else
				{
					var wrapTextSuccess = wrapText(tmpInputs, startLine, 8, 40, e.target.result.directionText);

					if (wrapTextSuccess && tmpInputs.index($(":focus")) != tmpInputs.length)
					{
						$(":focus").next()[0].focus();
					}
				}
			};
		}
		else
		{
			finishLabel();
		}
	}
	else
	{
		if (this.charsSinceLastEnter == "")
		{
			this.originalString = this.value;
		}
		this.charsSinceLastEnter += String.fromCharCode(e.which);
	}
}

function bdis_opt1_label_line_keypress_2(e)
{
	if (e.which == 13)
	{
		finishLabel();
	}
	else if (e.target.value.length >= e.target.maxLength)
	{
		if (e.which != 32)
		{
			var lineVal = $(":focus").val();
			var nextLineVal = lineVal.substring(lineVal.lastIndexOf(" ") + 1, lineVal.length);
			var newLineVal = lineVal.substring(0, lineVal.lastIndexOf(" "));

			$(":focus").val(newLineVal);
			$(":focus").next().val(nextLineVal + String.fromCharCode(e.which));
		}

		$(":focus").next()[0].focus();

		e.preventDefault();
	}
}

function bdis_opt1_label_line_keypress_3(e)
{
	var keyIndentifier = e.originalEvent.key;
}

function bdis_opt1_label_line_keydown_3(e)
{
	var keyIndentifier = e.originalEvent.key;

	if (e.originalEvent.key == "F11")
	{
		if (e.shiftKey)
		{
			var startPos = $("#bdis_opt1_label_holder input").index($(":focus")[0]);
			var arrLength = $("#bdis_opt1_label_holder input").length;

			for (var i = startPos; i < arrLength-1; i++)
			{
				$("#bdis_opt1_label_holder input")[i].value = $("#bdis_opt1_label_holder input")[i+1].value;
			}
			$("#bdis_opt1_label_holder input")[arrLength-1].value = "";
		}
		else
		{

		}
		e.preventDefault();
	}
	else if (e.originalEvent.key == "F12")
	{
		if (e.shiftKey)
		{
			var startPos = $("#bdis_opt1_label_holder input").index($(":focus")[0]);
			var arrLength = $("#bdis_opt1_label_holder input").length;

			for (var i = arrLength-1; i > startPos; i--)
			{
				$("#bdis_opt1_label_holder input")[i].value = $("#bdis_opt1_label_holder input")[i-1].value;
			}
			$("#bdis_opt1_label_holder input")[startPos].value = "";
		}
		else
		{

		}
		e.preventDefault();
	}
	else if (e.originalEvent.key == "F9")
	{
		finishLabel();
		e.preventDefault();
	}
	else if (e.originalEvent.key == "Up")
	{
		var elementForFocus = $(":focus").prev("#bdis_opt1_label_holder input")[0];
		if (elementForFocus != null) elementForFocus.focus();
		e.preventDefault();
	}
	else if (e.originalEvent.key == "Down")
	{
		var elementForFocus = $(":focus").next("#bdis_opt1_label_holder input")[0];
		if (elementForFocus != null) elementForFocus.focus();
		e.preventDefault();
	}
	else
	{

	}
}

function bdis_opt1_label_line_keydown(e)
{
	if (e.which == 8)
	{
		if (e.altKey == true)
		{
			var focusedLine = $(":focus")[0];
			if (focusedLine.value.length >= 1)
			{
				focusedLine.value = focusedLine.value.substring(0, focusedLine.value.length-1);
			}

			if ((focusedLine.selectionStart == 0) && (focusedLine.selectionEnd == 0))
			{
				if (focusedLine.previousElementSibling != null)
				{
					focusedLine.previousElementSibling.focus();
				}
			}

			if (bdis_label_mode_iscode)
			{
				if (focusedLine.charsSinceLastEnter.length >= 1)
				{
					focusedLine.charsSinceLastEnter = focusedLine.charsSinceLastEnter.substr(0, focusedLine.charsSinceLastEnter.length-1);
				}
			}
		}
		else
		{
			e.preventDefault();
		}
	}
	else if (e.originalEvent.key == "F9")
	{
		$("#bdis_opt1_label_holder input").unbind("keypress");
		if (bdis_label_mode_iscode)
		{
			bdis_label_mode_iscode = false;
			showUserMessage("FREE TEXT BEING USED - PRESS F9 TO ENTER DIRECTION CODES");
			if (($(":focus")[0] != null) && ($(":focus")[0].charsSinceLastEnter != null) && ($(":focus")[0].charsSinceLastEnter != ""))
			{
				var focusedLine = $(":focus")[0];
				var charsSinceLastEnter = focusedLine.charsSinceLastEnter;
				var inputLineValue = $(focusedLine).val();
				var regexpattern = new RegExp(charsSinceLastEnter + "$");
				$(focusedLine).val(inputLineValue.replace(regexpattern, ""));
			}
			$("#bdis_opt1_label_holder input").bind("keypress", bdis_opt1_label_line_keypress_2);
		}
		else
		{
			bdis_label_mode_iscode = true;
			showUserMessage("ENTER DIRECTIONS AS A CODE OR PRESS F9 FOR FREE TEXT");
			$("#bdis_opt1_label_holder input").bind("keypress", bdis_opt1_label_line_keypress);
		}
		e.preventDefault();
	}
}

function bdis_opt1_quantity_required_keypress(e)
{
	if (e.which == 13)
	{
		e.preventDefault();

		if ($("#bdis_opt1_quantity_required").val().indexOf("^") >= 0)
		{
			reinit_bdis_opt1();
		}
		else if ($("#bdis_opt1_quantity_required").val().indexOf("N") >= 0)
		{
			$("#bdis_opt1_label_holder input").unbind("keypress");
			$("#bdis_opt1_label_holder input").unbind("keydown");

			$("#bdis_opt1_label_holder input").bind("keypress", bdis_opt1_label_line_keypress_3);
			$("#bdis_opt1_label_holder input").bind("keydown", bdis_opt1_label_line_keydown_3);

			$("#bdis_opt1_label_holder input")[1].focus();
			showUserMessage("PRESS F9 TO FINISH LABEL");
		}
		else
		{
			var tmpVal = parseInt($("#bdis_opt1_quantity_required").val());

			if (tmpVal > 0)
			{
				$("#bdis")[0].labelinfo["printquantity"] = tmpVal;
				if ($("#bdis_opt1_bnf_codes_title").length > 0)
				{
					bdis_opt1_printbnf();
				}
				else
				{
					bdis_opt1_finishlabelprompt();
				}
				sendXmlToLabelPrinter(createLabelXML());
			}
		}
	}
	else if (((e.which > 47) && (e.which < 58)) || (e.which === 94) || (e.which == 78))
	{
		// 0 to 9 or ^ or N
	}
	else
	{
		e.preventDefault();
	}
}

function bdis_opt1_print_bnf_keypress(e)
{
	if (e.which == 13)
	{
		e.preventDefault();

		var tmpVal = $("#bdis_opt1_print_bnf").val();

		if (tmpVal.length === 1)
		{
			if (tmpVal == "^")
			{
				$("#bdis_opt1_print_bnf").val("");
				$("#bdis_opt1_quantity_required").val("");
				$("#bdis_opt1_quantity_required")[0].focus();
			}
			else if (tmpVal == "Y")
			{
				printSupplementaryLabels($("#bdis")[0].labelinfo["drug"]);
				bdis_opt1_finishlabelprompt();
			}
			else if (tmpVal == "N")
			{
				bdis_opt1_finishlabelprompt();
			}
		}
	}
	else if ((e.which === 78) || (e.which === 89) || (e.which === 94))
	{
		// Y OR N OR ^
	}
	else
	{
		e.preventDefault();
	}
}

//=================================================================
//                   BDIS KEY PRESS EVENTS - END
//=================================================================


function bdis_opt1_input_keypress(e)
{
	if (e.which == 13)
	{
		var inputs = $("input");
		var nextInput = inputs.get(inputs.index(e.target) + 1);
		if (nextInput != null)
			nextInput.focus();
		else
			e.target.blur();
	}
}
