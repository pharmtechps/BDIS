var _socket;
var userInitials;

var d = new Date();
var day = "0" + d.getDate();
if (day.length === 3) day = day.substr(1, 2); 
var month = "0" + (d.getMonth() + 1);
if (month.length === 3) month = month.substr(1, 2);
var year = "" + d.getFullYear();

var weekdays= new Array(7);

weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

//=================================================================
//                     MAIN FUNCTIONS - START                          
//=================================================================

function loginUser(password)
{
	var transaction = pimsDB.transaction("users");
	var objectStore = transaction.objectStore("users");
	var request = objectStore.get(password);
	request.onsuccess = function(e)
	{
		if (e.target.result == null)
		{
			$("#login_password").val("");
			showUserMessage("INVALID PASSWORD");
		}
		else
		{
			userInitials = e.target.result.initials;
			hideUserMessage();
			$("#login_password").css("display", "none");
			initMenu();
		}
	};	
}

function initMenu()
{
	$("#menu").css("display", "block");
	$("#menu_selection")[0].focus();
	$("#menu_selection").bind("keypress", menu_selection_keypress);
}

function wrapText(arrInputs, startLine, endLine, wrapLength, strData, topToBottom)
{
	var x;
	var i = startLine;
	
	strData = strData.replace(/\s{2,}/g, " ");
	var wordsToWrap = strData.split(" ");
	
	//LOOP THROUGH EACH WORD THAT NEEDS TO BE WRAPPED
	for (x = 0; x < wordsToWrap.length; x++)
	{
		var tmpInput = arrInputs[i];
		
		//CHECK IF CURRENT LINE IS BLANK SO A SPACE CAN BE ACCOUNTED FOR
		if (tmpInput.value.length == 0)
		{
			//CHECK IF THE NEW WORD IS LONGER THAN THE WRAP LENGTH
			if (wordsToWrap[x].length <= wrapLength)
			{
				//IF NOT - ADD THE NEXT WORD
				tmpInput.value = wordsToWrap[x];
			}
			else
			{
				//IF SO - RUN THE INSUFFICIENTSPACE FUNCTION
				insufficiantSpace();
				arrInputs[i].focus();
				return false;
			}
		}
		else
		{
			//CHECK IF ADDING THE NEW WORD WILL EXTEND PAST THE WRAP LENGTH
			if (tmpInput.value.length + 1 + wordsToWrap[x].length <= wrapLength)
			{
				//IF NOT - ADD A SPACE AND THE NEXT WORD
				tmpInput.value += " " + wordsToWrap[x];
			}
			else
			{
				//IF SO - RUN THE INSUFFICIENTSPACE FUNCTION
				insufficiantSpace();
				arrInputs[i].focus();
				return false;
			}
		}
		
		if (x+1 < wordsToWrap.length)
		{
			// CHECK IF THE CURRENT INPUT LENGTH AND THE NEXT WORD ARE GREATER THAN THE WRAP LENGTH
			if ((tmpInput.value.length + 1 + wordsToWrap[x+1].length) > wrapLength) 
			{
				//IF THE WRAP LENGTH IS EXCEEDED CHECK IF WE'RE ALREADY AT THE END LINE
				if ((i+1) <= endLine)
				{
					//IF NOT - MOVE TO THE NEXT LINE
					i++;
				}
				else
				{
					//IF SO - RUN THE INSUFFICIENT SPACE FUNCTION AND END WRAPTEXT METHOD
					insufficiantSpace();
					arrInputs[i].focus();
					return false;	
				}
			}
		}
	}
	
	arrInputs[i].focus();
	return true;
	
	function insufficiantSpace()
	{
		// WORK BACKWARDS FROM CURRENT WORD AND LINE UNTIL BOTH ARE ZERO?!
		while (( x >= 0 ) && ( i >= 0 ))
		{							
			var tmpStr = arrInputs[i].value;
			
			// CHECK IF THE CURRENT WORD IS THE LAST WORD IN THE STRING
			if (wordsToWrap[x] == tmpStr.substring(tmpStr.length - wordsToWrap[x].length, tmpStr.length))
			{
				//IF SO - REMOVE IT AND MOVE TO THE PREVIOUS WORD
				arrInputs[i].value = tmpStr.substring(0, tmpStr.length - wordsToWrap[x].length);
				
				//CHECK IF THE LAST CHARACTER IN THE INPUT IS A SPACE
				if (arrInputs[i].value.charAt(arrInputs[i].value.length-1) == " ")
				{
					// IF SO - REMOVE THE SPACE
					arrInputs[i].value = arrInputs[i].value.substr(0, arrInputs[i].value.length - 1);	
				}
			
				x--;
			}
			else
			{
				//IF NOT - MOVE TO THE PREVIOUS LINE AND START THE CHECKS AGAIN
				i--;
			}
		}
		
		showUserMessage("INSUFFICIENT SPACE");	
	}
}

function moveTextToBottom(arrInputs)
{
	var blankLines = 0;
	
	for (var i = arrInputs.length - 1; i >= 0; i--)
	{
		if (arrInputs[i].value == "") blankLines++;
		else break;
	}
	
	for (var i = arrInputs.length - 1; (i-blankLines) >= 0; i--)
	{
		arrInputs[i].value = arrInputs[i-blankLines].value;
	}
	
	for (var i = 0; i < blankLines; i++)
	{
		arrInputs[i].value = "";	
	}
}

function initProgramList()
{
	$("body > div").css("display", "none");
	$("#programList").css("display", "block");
	initMenu();
}

function showUserMessage(usermsg)
{
	hideUserMessage();
	var tmpPre = document.createElement("pre");
	tmpPre.id = "usermessage";
	tmpPre.innerHTML = usermsg;
	$(document.body).append(tmpPre)
}

function hideUserMessage()
{
	$("#usermessage").remove();
}

function escapeHTML(tmpString)
{
    var pre = document.createElement("pre");
    var text = document.createTextNode(tmpString);
    pre.appendChild(text);
    return pre.innerHTML;
}

function sendXmlToLabelPrinter(strXML)
{
	if (_socket == null)
	{
		console.log("creating socket");
		_socket = new WebSocket("ws://127.0.0.1:50/");
		_socket.binaryType = "arraybuffer";
		
		_socket.onopen = function()
		{
			console.log("socket opened");
			_socket.send(strXML);
				
			var intClose = setInterval
			( 
				function()
				{
					console.log("checking socket buffer");
					if (_socket.bufferedAmount == 0)
					{
						console.log("closing socket");
						_socket.close();
						_socket = null;
						clearTimeout(intClose);
					}
				},
				250
			);
			
			hideUserMessage();
		};
		
		_socket.onmessage = function(e)
		{
			console.log(e.data);
		};
		
		_socket.onerror = function(myErr)
		{
			console.log("error connecting to label printer, set timer to try again");
			_socket.close();
			_socket = null;
			
			showUserMessage("Error: Please check label printer is running (Retrying in 5s)");
			setTimeout(function(){hideUserMessage()}, 2000);
			setTimeout(function(){sendXmlToLabelPrinter(strXML)}, 5000);
		};
	}
	else
	{
		setTimeout(function(){sendXmlToLabelPrinter(strXML)}, 1000);
	}
}

function isDate(tmpStr)
{
	var regex = /^(\d\d)\/(\d\d)\/(\d\d\d\d)$/gi;
	var m = regex.exec(tmpStr);

	if ((m != null) && (m.length == 4))
	{
		var d1 =+ m[1];
		var m1 =+ m[2];
		var y1 =+ m[3];
		
		var tmpDate = new Date(y1,m1-1,d1);
		
		if (tmpDate.getFullYear()===y1 && tmpDate.getMonth()===m1-1)
		{
			return true;   
		}
	}
	return false;
}

function getDate(tmpStr)
{
	var regex = /^(\d\d)\/(\d\d)\/(\d\d\d\d)$/gi;
	var m = regex.exec(tmpStr);

	if ((m != null) && (m.length == 4))
	{
		var d1 =+ m[1];
		var m1 =+ m[2];
		var y1 =+ m[3];
		
		var tmpDate = new Date(y1,m1-1,d1);
		
		if (tmpDate.getFullYear()===y1 && tmpDate.getMonth()===m1-1)
		{
			return tmpDate;   
		}
	}
	return null;
}

//=================================================================
//                       MAIN FUNCTIONS - END                        
//=================================================================



//=================================================================
//                  MAIN KEY PRESS EVENTS - START
//=================================================================

function document_keydown(e)
{
	if (e.which == 9) e.preventDefault();
}

function login_password_keypress(e)
{
	if (e.which == 13)
	{
		var tmpPassword = $("#login_password").val();
		loginUser(tmpPassword);
	}
}

function menu_selection_keypress(e)
{
	if (e.which == 13)
	{
		$("span#programNotDefined").css("display", "none");
		switch($("#menu_selection").val())
		{
			case "M":
				initProgramList();
				break;
			case "BDIS": 
				init_bdis();
				break;
			case "END":
				window.close();
				break;
			default:
				$("span#programNotDefined").css("display", "block");
		}
		$("#menu_selection").val("")
	}
}

//=================================================================
//                   MAIN KEY PRESS EVENTS - END
//=================================================================