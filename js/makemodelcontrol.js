
/* ============================================================================
*  Copyright: 2008 Montway Auto Transport, Inc.
*  Date: 2008-09-12-17:46
*
*  This file is to activate the make/model selection lists of pages. The
*  selection list elements are expected to be passed in as arguments for the
*  methods to avoid being tied to any one implementation.
*
*  The allMakeArray, makeArray, and modelArray variables store all the
*  possible makes and models that are available to the system. These are most
*  likely generated values with backend PHP/JSP/ASP/CGI tied to a flat file
*  or other form of database.
*  ========================================================================= */

function resetMakeSelection(makeSelect, firstValue)
{
	resetSelection(makeSelect, "Select Make");
}


function resetModelSelection(modelSelect, firstValue)
{
	resetSelection(modelSelect, "Select Model");
}


/* ============================================================================
*  Called after setting up the make and model selection, to select particular
*  values for make and model. Useful to reflect preset or existing values.
*  ========================================================================= */
function selectMakeModel(makeSelect, makeValue, modelSelect, modelValue)
{
	selectOption(makeSelect, makeValue);
	updateModel(modelSelect, makeValue);
	if (modelSelect != null && modelValue != null) selectOption(modelSelect, modelValue);
}


/* ============================================================================
*  Called from HTML form with onChange(), whenever an automobile make selection
*  pull-down option is changed. Usually to fill in the model selection
*  pull-down options with the appropriate models, based on make.
*  ========================================================================= */
function updateModel(modelSelect, selectedMake)
{
	if (selectedMake == "")
	{
		resetSelection(modelSelect, "Select Model");
		return;
	}

	fillModelSelection(modelSelect, selectedMake);
}


/* ============================================================================
*  Called by HTML onLoad() to fill an HTML form's Make selection list. It will
*  use the fillSelection from utils.js and the Make array. The values are taken
*  from an array defined dynamically by PHP, via file or database.
*  ========================================================================= */
function fillMakeSelection(targetSelect)
{
	fillSelection(targetSelect, makeArray);
}


/* ============================================================================
*  Called by updateModel() and from the HTML onLoad() to fill an HTML form's
*  Model selection, based on make. The values are taken from an array var
*  defined dynamically by PHP, via file or database.
*  ========================================================================= */
function fillModelSelection(targetSelect, selectedMake)
{
	//alert("Inside fillModelSelection: selectText[" + selectText + "] formName[" + formName + "] targetSelectName[" + targetSelectName + "]");

	// First clear out the old array
	resetSelection(targetSelect, "Select Model");

	var counter = 1;
	for(var j = 0; j < modelArray.length; j++)
	{
		if (modelArray[j][1] == selectedMake)
		{
			targetSelect.options[counter] = new Option();
			targetSelect.options[counter].text = modelArray[j][0];
			targetSelect.options[counter].value = modelArray[j][0];
			counter++;
		}
	}
	targetSelect.length = counter;	// Truncate the extra options.

}
