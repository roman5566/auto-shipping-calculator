/* ============================================================================
*  The function setupMakeModel is run at the loading of the webpage. The
*  odd mechanics of the structure is to be as compatible with as many browers
*  as possible. The function will populate the makes after the browser is
*  finished loading the page.
*  ========================================================================= */
function setupMakeModel()
{
	resetMakeSelection(document.quoteform.automake);
	resetModelSelection(document.quoteform.automodel);

	fillMakeSelection(document.quoteform.automake);

	if (typeof(in_automake) != 'undefined' && in_automake != '' &&
		typeof(in_automodel) != 'undefined' && in_automodel != ''
	) {
		selectMakeModel(document.quoteform.automake, in_automake, document.quoteform.automodel, in_automodel);
	}
}

/* ============================================================================
*  Displays options that come back from Maps API
*  ========================================================================= */
function displayCityStateOptions(which, result, is_affiliate)
{
	is_affiliate = typeof is_affiliate !== 'undefined' ? is_affiliate : false;

	var thisSelect = document.getElementById(which+"select");
	thisSelect.length = 0;

	thisSelect.options[0] = new Option("Select city, state", '0');
	for (var i = 1; i <= result.length; i++)
	{
		thisSelect.options[i] = new Option();
		thisSelect.options[i].text = result[i-1];
		thisSelect.options[i].value = result[i-1];
	}

	var thisSelectInput = document.getElementById(which+"selectinput");
	var thisTextInput = document.getElementById(which+"textinput");

	if(!thisSelectInput) thisSelectInput = document.getElementById(which+"select");
	if(!thisTextInput) thisTextInput = document.getElementById(which+"text");

	thisTextInput.style.display = "none";
	thisSelectInput.style.display = "block";

	thisSelect.style.color = "rgb(255,0,0)";
	if(!is_affiliate)
	{
		thisSelect.style.fontWeight = "bold";
		thisSelect.style.width = "210px";
	}
}

/* ============================================================================
*  Displays options that come back from Maps API in the big calc in auto-transport-quote.php
*  ========================================================================= */
function displayCityStateOptionsBig(which, result)
{
	var thisSelect = document.getElementById(which+"select");
	thisSelect.length = 0;

	thisSelect.options[0] = new Option("Select city, state", '0');
	for (var i = 1; i <= result.length; i++)
	{
		thisSelect.options[i] = new Option();
		thisSelect.options[i].text = result[i-1];
		thisSelect.options[i].value = result[i-1];
	}

	var thisSelectInput = document.getElementById(which+"selectinput");
	var thisTextInput = document.getElementById(which+"textinput");

	document.getElementById(which + 'CityInput').style.display = 'none';
	thisSelectInput.style.display = "block";
	thisSelect.style.display = "block";
	thisSelect.style.color = "rgb(255,0,0)";
	thisSelect.style.fontWeight = "bold";
	thisSelect.style.width = "210px";
}

/* ============================================================================
*  Displays an error message
*  ========================================================================= */
function displayCalcError(message)
{
	//var resultmessage = document.getElementById("resultmessage");
	//resultmessage.innerHTML = message;

	if (message != '') {
		$('#light').hide();
		$('#fade').hide();
		alert(message);
	}
}
