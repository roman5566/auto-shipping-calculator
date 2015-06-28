/* ============================================================================
*  Author: Alex Oh, Grok, Inc.
*  Copyright: 2008 Montway Auto Transport, Inc.
*  Date: 2008-09-12-17:46
*
*  This file is to activate the Maps API interface. It takes care of
*  the initialization of the interface and handles all the data going back and
*  forth from some Map API.
*  ========================================================================= */

// The directions and geo variables are used to reference the Maps API objects later in the code.
var directions;
var geo;

// The continueDirections variable is a simple boolean that prevents additional directions lookup if there are any problems with the from or to addresses.
var continueDirections;
var continueSubmit;
// The from, to, and route variables store the from and to strings used for directions and distance. The route variable specifically just concatenates the from and to with a string literal " to ". The countryRestrict variable is an extra search restriction appended at the end of the from and to variable, before sending to the Maps API. The optionsCallback is a function pointer to call a method that will be called whenever there are errors in trying to determine distance, or if there are alternatives for the from and to input values.
var from;
var fromCity;
var fromState;
var fromCounty;
var fromZipGiven;
var fromZip;
var fromLat;
var fromLong;
var fromExcludedState;
var fromStateFullName;
var fromZipCount;
var to;
var toCity;
var toState;
var toCounty;
var toZipGiven;
var toZip;
var toLat;
var toLong;
var toExcludedState;
var toStateFullName;
var toZipCount;
var totalD;
var fromDni;
var toDni;
var totalDni;
var route;
var countryRestrict = "USA";
var countryCode = "US";
var optionsCallback;
var distanceCallback;
var successCallback;

var fromCityState;
var toCityState;

var fromCityState;
var toCityState;


// The reasons array variable is to store the GClientGeocoder error types to
// make error messages more human readable and informative.
var reasons=[];
var G_GEO_SUCCESS = 1001;
var G_GEO_MISSING_ADDRESS = 1002;
var G_GEO_UNKNOWN_ADDRESS = 1003;
var G_GEO_UNAVAILABLE_ADDRESS = 1004;
var G_GEO_BAD_KEY = 1005;
var G_GEO_TOO_MANY_QUERIES = 1006;
var G_GEO_SERVER_ERROR = 1007;
reasons[G_GEO_SUCCESS]			= "Success";
reasons[G_GEO_MISSING_ADDRESS]	= "The address was either missing or had no value.";
reasons[G_GEO_UNKNOWN_ADDRESS]	= "No corresponding geographic location could be found for the specified address.";
reasons[G_GEO_UNAVAILABLE_ADDRESS] = "The geocode for the given address cannot be returned due to legal or contractual reasons.";
reasons[G_GEO_BAD_KEY]			= "The API key is either invalid or does not match the domain for which it was given";
reasons[G_GEO_TOO_MANY_QUERIES]	= "The daily geocoding quota for this site has been exceeded.";
reasons[G_GEO_SERVER_ERROR]		= "Server error: The geocoding request could not be successfully processed.";

// Custom codes
var ALTERNATIVES_FOUND_FROM = 9991;
var ALTERNATIVES_FOUND_TO = 9992;
var UNAVAILABLE_CITY = 9999;
var BLANK_ADDRESS = 9998;
var DISTANCE_UNKNOWN = 9997;
reasons[ALTERNATIVES_FOUND_FROM]= "Could not find the city/zip you indicated. Please consider choosing these alternatives, or Reset and try again.";
reasons[ALTERNATIVES_FOUND_TO]	= "Could not find the city/zip you indicated. Please consider choosing these alternatives, or Reset and try again.";
reasons[UNAVAILABLE_CITY]		= "Please try again, using the zip code. Otherwise, please check the spelling of city and state and try again.";
reasons[BLANK_ADDRESS]			= "Please make sure both from and to addresses are filled.";
reasons[DISTANCE_UNKNOWN]		= reasons[UNAVAILABLE_CITY];

// All states and abbreviations for being able to determine abbreviations for when the Maps API does not return the abbreviations
var allStates = new Array("ALABAMA","ALASKA","AMERICAN SAMOA","ARIZONA","ARKANSAS","CALIFORNIA","COLORADO","CONNECTICUT","DELAWARE","DISTRICT OF COLUMBIA","FEDERATED STATES OF MICRONESIA","FLORIDA","GEORGIA","GUAM","HAWAII","IDAHO","ILLINOIS","INDIANA","IOWA","KANSAS","KENTUCKY","LOUISIANA","MAINE","MARSHALL ISLANDS","MARYLAND","MASSACHUSETTS","MICHIGAN","MINNESOTA","MISSISSIPPI","MISSOURI","MONTANA","NEBRASKA","NEVADA","NEW HAMPSHIRE","NEW JERSEY","NEW MEXICO","NEW YORK","NORTH CAROLINA","NORTH DAKOTA","NORTHERN MARIANA ISLANDS","OHIO","OKLAHOMA","OREGON","PALAU","PENNSYLVANIA","PUERTO RICO","RHODE ISLAND","SOUTH CAROLINA","SOUTH DAKOTA","TENNESSEE","TEXAS","UTAH","VERMONT","VIRGIN ISLANDS","VIRGINIA","WASHINGTON","WEST VIRGINIA","WISCONSIN","WYOMING","N CAROLINA","N DAKOTA","S CAROLINA","S DAKOTA","W VIRGINIA", "RHODE ISL");
var allStateAbbrev = new Array("AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY","NC","ND","SC","SD","WV","RI");



/* ============================================================================
*  Called from HTML after the user has finished the form. The from and to
*  addresses are checked individually to see if they can be singly resolved to
*  one city/state combination so that they can be used reliably to find proper
*  distances. The listAlternatives() method is used. The parameters fromtext
*  and totext are values to be used to determine distance. The callback
*  parameter is a callback function pointer that will be called after
*  processing, along with parameters. If the query generates and error, the
*  parameters to the callback will be an error code and error message. If the
*  query generates alternative addresses, the callback parameters will be a
*  string to indicate "from" or "to" and an Array of address alternatives.
*  ========================================================================= */
function getMiles(fromtext, totext, inOptionsCallback, inSuccessCallback)
{
	continueDirections = false;

	optionsCallback = inOptionsCallback;
	successCallback = inSuccessCallback;

	var	excludedStates = false;

	if (fromtext && totext)
	{
		$.getJSON("/admin/includes/geolocation.php"
			, { "addrtext": fromtext }
			, function(returnJson)
			{
				if (returnJson != null && returnJson.numlocations > 0)
				{
					var allLocations = new Array();
					$zipGiven = returnJson.zipGiven;

					$.each(returnJson.locations, function(i, location)
					{
						var thisLocation = new Array();
						thisLocation['zipGiven'] = $zipGiven
						thisLocation['zipcode'] = location.zipcode;
						thisLocation['state'] = location.state;
						fromState = location.state;
						thisLocation['city'] = location.city;
						thisLocation['county'] = location.county;
						thisLocation['latitude'] = location.latitude;
						thisLocation['longitude'] = location.longitude;
						allLocations[i] = thisLocation;
					});

					if((typeof excluded_states != 'undefined'))
					{
						var matchExFromState = $.inArray(fromState, excluded_states);

						if(matchExFromState >= 0)
						{
							if(excludedStates !== false)
							{
								excludedStates = fromState +' '+excludedStates;
							}
							else
							{
								excludedStates = fromState;
							}

							displayError("from", 'You can not do this calculation because the state('+excludedStates+') is excluded');
						}
						else
						{
							listAlternatives("from", allLocations);
						}
					}
					else
					{
						listAlternatives("from", allLocations);
					}
				}
				else
				{
					if(fromCityState && fromCityState.length > 0)
					{
						optionsCallback('from', new Array());
						continueDirections = false;
					}
					else
					{
						displayError("from", reasons[UNAVAILABLE_CITY] + " [111]");
					}
				}
			});

		$.getJSON("/admin/includes/geolocation.php"
			, { "addrtext": totext }
			, function(returnJson)
			{
				if (returnJson != null && returnJson.numlocations > 0)
				{
					var allLocations = new Array();
					$zipGiven = returnJson.zipGiven;

					$.each(returnJson.locations, function(i, location)
					{
						var thisLocation = new Array();
						thisLocation['zipGiven'] = $zipGiven
						thisLocation['zipcode'] = location.zipcode;
						thisLocation['state'] = location.state;
						toState = location.state;
						thisLocation['city'] = location.city;
						thisLocation['county'] = location.county;
						thisLocation['latitude'] = location.latitude;
						thisLocation['longitude'] = location.longitude;
						allLocations[i] = thisLocation;
					});

					if((typeof excluded_states != 'undefined'))
					{
						var matchExToState = $.inArray(toState, excluded_states);

						if(matchExToState >= 0)
						{
							if(excludedStates !== false)
							{
								excludedStates = excludedStates +' '+ toState;
							}
							else
							{
								excludedStates = toState;
							}

							displayError("to", 'You can not do this calculation because the state('+excludedStates+') is excluded');
						}
						else
						{
							listAlternatives("to", allLocations);
						}
					}
					else
					{
						listAlternatives("to", allLocations);
					}
				}
				else
				{
					if(optionsCallback && toCityState && toCityState.length > 0)
					{
						optionsCallback('to', new Array());
						continueDirections = false;
					}
					else
					{
						displayError("to", reasons[UNAVAILABLE_CITY] + " [111]");
					}
				}
			});
	}
	else
	{
		displayError("", reasons[BLANK_ADDRESS] + " [101]");
	}
}


function getMilesAsync(fromtext, totext, inOptionsCallback, inSuccessCallback)
{
	continueDirections = false;

	optionsCallback = inOptionsCallback;
	successCallback = inSuccessCallback;

	if (fromtext && totext)
	{
		$.ajax({
			url: "/admin/includes/geolocation.php",
			data: "addrtext=" + fromtext,
			async: false,
			dataType: 'json',
			success: function (returnJson) {
				if (returnJson != null && returnJson.numlocations > 0)
				{
					var allLocations = new Array();
					$zipGiven = returnJson.zipGiven;

					$.each(returnJson.locations, function(i, location)
					{
						var thisLocation = new Array();
						thisLocation['zipGiven'] = $zipGiven
						thisLocation['zipcode'] = location.zipcode;
						thisLocation['state'] = location.state;
						thisLocation['city'] = location.city;
						thisLocation['county'] = location.county;
						thisLocation['latitude'] = location.latitude;
						thisLocation['longitude'] = location.longitude;
						allLocations[i] = thisLocation;
					});

					getMilesResult = true;
					listAlternatives("from", allLocations);
				}
				else
				{
					getMilesResult = false;
					if(fromCityState && fromCityState.length > 0)
					{
						optionsCallback('from', new Array());
						continueDirections = false;
					}
					else
					{
						displayError("from", reasons[UNAVAILABLE_CITY] + " [111]");
					}
				}
			}

		});

		if (getMilesResult)
		{
			$.ajax({
				url: "/admin/includes/geolocation.php",
				data: "addrtext=" + totext,
				async: false,
				dataType: 'json',
				success: function (returnJson) {
					if (returnJson != null && returnJson.numlocations > 0)
					{
						var allLocations = new Array();
						$zipGiven = returnJson.zipGiven;

						$.each(returnJson.locations, function(i, location)
						{
							var thisLocation = new Array();
							thisLocation['zipGiven'] = $zipGiven
							thisLocation['zipcode'] = location.zipcode;
							thisLocation['state'] = location.state;
							thisLocation['city'] = location.city;
							thisLocation['county'] = location.county;
							thisLocation['latitude'] = location.latitude;
							thisLocation['longitude'] = location.longitude;
							allLocations[i] = thisLocation;
						});

						getMilesResult = true;
						listAlternatives("to", allLocations);
					}
					else
					{
						getMilesResult = false;
						if(optionsCallback && toCityState && toCityState.length > 0)
						{
							optionsCallback('to', new Array());
							continueDirections = false;
						}
						else
						{
							displayError("to", reasons[UNAVAILABLE_CITY] + " [111]");
						}
					}
				}
			});
		}
	}
	else
	{
		displayError("", reasons[BLANK_ADDRESS] + " [101]");
	}

	return getMilesResult;
}


/* ============================================================================
*  Called from getMiles(), this method does the bulk of the work with the
*  map objects. It first checks to make sure both the from and to
*  addresses can be singly resolved, and presents alternatives if there are
*  multiple possibilities with either from or to addresses. If both from and
*  to addresses are unique enough to determine distance, it uses the proper
*  Maps API calls to determine distance between the addresses.
*  ========================================================================= */
function listAlternatives(which, allLocations, callFromFrontend)
{

	callFromFrontend = typeof callFromFrontend !== 'undefined' ? true : false;

	//var message = "";
	var cityStateSelected = '';
	if(which == 'from')
	{
		cityStateSelected = fromCityState;
	}
	else if(which == 'to')
	{
		cityStateSelected = toCityState;
	}

	if (allLocations.length > 0)
	{
		//message += "Ambiguous " + which + " address. Did you mean: <br />";
		var options = new Array();

		// Loop through the results
		for (var i = 0; i < allLocations.length; i++)
		{
			if (!isNaN($('#' + which + 'text').val()))
			{
				newAddr = allLocations[i]['city'] + ", " + allLocations[i]['state'] + " " + allLocations[i]['zipcode'];
			}
			else
			{
				newAddr = allLocations[i]['city'] + ", " + allLocations[i]['state'];
			}
			var inArr = false;
			for (var j = 0; j < options.length; j++) if (options[j] == newAddr) inArr = true;
			if (!inArr) options[options.length] = newAddr;

			if(cityStateSelected && cityStateSelected.trim().toUpperCase()==newAddr.trim().toUpperCase())
			{
				options = new Array();
				options[options.length] = newAddr;
				break;
			}
		}

		// ===== If there was more than one result, Ask "did you mean" on them all =====
		if (options.length == 0)
		{
			if(cityStateSelected)
			{
				optionsCallback(which, options);
				continueDirections = false;
			}
			else
			{
				displayError(which, reasons[UNAVAILABLE_CITY] + " [211]");
			}
		}
		else if (options.length > 1)
		{
			continueSubmit = false;
			optionsCallback(which, options);
			continueDirections = false;
		}
		else if (options.length == 1)
		{
			// ===== If we're here, there was only one placemark result for the address =====
			//alert("Only one result for " + which + " address: [" + allLocations[0]['city'] + "]");

			//if (allLocations[0]['state'] != "HI" && allLocations[0]['state'] != "AK")
			{
				newAddr = allLocations[0]['city'] + ", " + allLocations[0]['state'];

				if(cityStateSelected && cityStateSelected.trim().toUpperCase() != newAddr.trim().toUpperCase())
				{
					optionsCallback(which, options);
					continueDirections = false;
					return;
				}

				//updateDisplay(which, newAddr);
				updateDisplay(which, allLocations[0]['city'], allLocations[0]['state'], allLocations[0]['zipcode']);

				if (which == "from")
				{
					from = newAddr;
					fromZipGiven = allLocations[0]['zipGiven'];
					fromZip = allLocations[0]['zipcode'];
					fromState = allLocations[0]['state'];
					fromCity = allLocations[0]['city'];
					fromCounty = allLocations[0]['county'];
					fromLat = allLocations[0]['latitude'];
					fromLong = allLocations[0]['longitude'];
				}
				else if (which == "to")
				{
					to = newAddr;
					toZipGiven = allLocations[0]['zipGiven'];
					toZip = allLocations[0]['zipcode'];
					toState = allLocations[0]['state'];
					toCity = allLocations[0]['city'];
					toCounty = allLocations[0]['county'];
					toLat = allLocations[0]['latitude'];
					toLong = allLocations[0]['longitude'];
				}

				// The continueDirections variable is a simple boolean that prevents a directions lookup
				// if there are any problems with the from or to addresses, or if the validation of both
				// addresses is yet incomplete.
				if (continueDirections)
				{
					//alert("PREDIRECTIONS: Getting directions for route: [" + route + "]");
					if(callFromFrontend == false)
					{
						getDistanceKML(fromZip, toZip);
					}
					continueDirections = false;
				}
				else
				{
					continueDirections = true;
				}
			}
			//else
			{
				//displayError(which, reasons[UNAVAILABLE_CITY] + " [231]");
			}
		}
		else
		{
			displayError(which, reasons[UNAVAILABLE_CITY] + " [221]");
		}
	}
	else
	{
		displayError(which, reasons[UNAVAILABLE_CITY] + " [201]");
	}
}


/*
 *
 * checks all data returned from the ajax request
 * when computing the distance between the two destinations
 *
 * */
function checkReturnedData(data, inOptionsCallback)
{
	optionsCallback = inOptionsCallback;

	if (data.from != null && data.from['numlocations'] > 0)
	{
		var allLocations = new Array();
		$zipGiven = data.from['zipGiven'];
		fromExcludedState = data.from.stateExcluded;
		fromZipCount = data.from.zipCount;
		$.each(data.from['locations'], function(i, location)
		{
			var thisLocation = new Array();
			thisLocation['zipGiven'] = $zipGiven
			thisLocation['zipcode'] = location.zipcode;
			thisLocation['state'] = location.state;
			thisLocation['city'] = location.city;
			thisLocation['county'] = location.county;
			thisLocation['latitude'] = location.latitude;
			thisLocation['longitude'] = location.longitude;
			fromStateFullName = location.StateFullName;
			allLocations[i] = thisLocation;
		});

		listAlternatives("from", allLocations, true);
		if (data.from['numlocations'] > 1)
		{
			$('#from_select_error').css({
				'left' : $('#fromselect').offset().left,
				'top' : $('#fromselect').offset().top - $('#from_select_error').height(),
				'z-index' : 1000
			});
			$('#from_select_error').show();
			$(window).resize(function(){
				$('#from_select_error').css({
					'left' : $('#fromselect').offset().left,
					'top' : $('#fromselect').offset().top - $('#from_select_error').height(),
					'z-index' : 1000
				});
			});
		}
		//if (document.getElementById("quoteform").disabled) document.getElementById("quoteform").disabled = false;
	}
	else
		displayError("from", reasons[UNAVAILABLE_CITY] + " [111]");

	toExcludedState = data.to.stateExcluded;
	toStateFullName = data.to.StateFullName;
	if (data.to != null && data.to['numlocations'] > 0)
	{
		var allLocations = new Array();
		$zipGiven = data.to['zipGiven'];
		toExcludedState = data.to.stateExcluded;
		toZipCount = data.to.zipCount;
		$.each(data.to['locations'], function(i, location)
		{
			var thisLocation = new Array();
			thisLocation['zipGiven'] = $zipGiven
			thisLocation['zipcode'] = location.zipcode;
			thisLocation['state'] = location.state;
			thisLocation['city'] = location.city;
			thisLocation['county'] = location.county;
			thisLocation['latitude'] = location.latitude;
			thisLocation['longitude'] = location.longitude;
			toStateFullName = location.StateFullName;
			allLocations[i] = thisLocation;
		});

		listAlternatives("to", allLocations, true);
		if (data.to['numlocations'] > 1)
		{
			$('#to_select_error').css({
				'left' : $('#toselect').offset().left,
				'top' : $('#toselect').offset().top - $('#to_select_error').height(),
				'z-index' : 1000
			});
			$('#to_select_error').show();
			$(window).resize(function(){
				$('#to_select_error').css({
					'left' : $('#toselect').offset().left,
					'top' : $('#toselect').offset().top - $('#to_select_error').height(),
					'z-index' : 1000
				});
			});
		}
	}
	else
		displayError("to", reasons[UNAVAILABLE_CITY] + " [111]");

	//if (document.getElementById("quoteform").disabled) document.getElementById("quoteform").disabled = false;

	if (data.distance != null && continueSubmit)
	{
		document.getElementById("distance").value = data.distance['total_distance'];
		document.getElementById("srcDistnoti").value = data.distance['source_distance'];
		document.getElementById("desDistnoti").value = data.distance['dest_distance'];
		document.getElementById("distnoti").value = data.distance['total_not_i'];

		updateFormAndSubmit();
	}

}

/* ============================================================================
*  Called from listAlternatives, once both the from and to addresses have been
*  successfully resolved. This will attempt to use a given Map KML API to
*  retrieve distance information, based on the provided addresses.
*  ========================================================================= */
function getDistanceKML(inFrom, inTo)
{
	$.ajax({
		url: "/admin/includes/geodistance.php",
		dataType: 'json',
		async: false,
		data: {
			"from": inFrom
			, "to": inTo
		},
		success: function(returnJson)
		{
			totalD = 0;
			fromDni = 0;
			toDni = 0;
			totalDni = 0;

			if (typeof(returnJson.total_distance) != 'undefined') totalD = Number(returnJson.total_distance).toFixed(2);
			if (typeof(returnJson.source_distance) != 'undefined') fromDni = Number(returnJson.source_distance).toFixed(2);
			if (typeof(returnJson.dest_distance) != 'undefined') toDni = Number(returnJson.dest_distance).toFixed(2);
			if (typeof(returnJson.total_not_i) != 'undefined') totalDni = Number(returnJson.total_not_i).toFixed(2);

			// We're ignoring the lat/long values returned, and using the ones from geolocation.php, instead.
			//if (typeof(returnJson.from_lat) != 'undefined') fromLong = returnJson.from_lat;
			//if (typeof(returnJson.from_long) != 'undefined') fromLat = returnJson.from_long;
			//if (typeof(returnJson.to_lat) != 'undefined') toLong = returnJson.to_lat;
			//if (typeof(returnJson.to_long) != 'undefined') toLat = returnJson.to_long;

			// If there's an error, first try to get the distances with city, state values rather than the zip values
			if (typeof(returnJson.error) != 'undefined' && returnJson.error.length > 0)
			{
				if (inFrom == fromZip || inTo == toZip) getDistanceKML(fromCity+", "+fromState, toCity+", "+toState);
				else displayError("", reasons[DISTANCE_UNKNOWN] + " [331]");
			}
			else if (!(totalD > 0))
			{
				if (inFrom == fromZip || inTo == toZip) getDistanceKML(fromCity+", "+fromState, toCity+", "+toState);
				else displayError("", reasons[DISTANCE_UNKNOWN] + " [341]");
			}
			else
			{
				if (successCallback != null) successCallback();
				else updateFormAndSubmit();
			}
		}
	});
}


/* ============================================================================
*  Called whenever an error occurs. Used to format and display the appropriate,
*  human readable error message.
*  ========================================================================= */
function displayError(placemark, errMessage)
{
	continueDirections = false;

	if (placemark != null) code = placemark + "error";

	optionsCallback(code, errMessage);
}


/* ============================================================================
*  Utility function to map incoming states to their proper abbreviations.
*  ========================================================================= */
function assertStateAbbrev(inputState)
{
	if (inputState)
	{
		if (inputState.length > 2)
		{
			for (var i = 0; i < allStates.length; i++)
			{
				if (inputState.toUpperCase() == allStates[i].toUpperCase())
				{
					return allStateAbbrev[i];
				}
			}
		}
		return inputState.toUpperCase();
	}
	return inputState;
}

/* ============================================================================
*  Utility function to determine if a string represents a numeric.
*  ========================================================================= */
function isNumber(inText)
{
	var numChars = "0123456789.";
	var isNum = true;
	var thisChar;

	// Loop through the chars in the text you passed in, testing each char
	for (var idx = 0; idx < inText.length; idx++)
	{
		thisChar = inText.charAt(idx);

		// If the current char is not a number then exit returning false
		if (numChars.indexOf(thisChar) == -1) return false;
	}

	// If you've made it this far then incoming text is all numeric.
	return true;
}


/* ============================================================================
*  Utility function to automatically update the fields on the form.
*  (Relocated to the specific display pages.)
*  ========================================================================= */
//function updateDisplay(which, newAddr)
//{
//	var thisDisplay = document.getElementById(which + "text");
//	if (thisDisplay != null) thisDisplay.value = newAddr;
//}


/* ============================================================================
*  Utility function to automatically fill in hidden values on the web page
*  form and submit it.
*  ========================================================================= */
function updateFormAndSubmit()
{
	/*
	 * MOVED TO FOOTER.PHP in the main ajax function
	document.getElementById("distance").value = totalD;
	document.getElementById("srcDistnoti").value = fromDni;
	document.getElementById("desDistnoti").value = toDni;
	document.getElementById("distnoti").value = totalDni;
	*/
	document.getElementById("fromCity").value = fromCity;
	document.getElementById("fromState").value = fromState;
	document.getElementById("fromZip").value = fromZip;
	document.getElementById("fromZipGiven").value = fromZipGiven;
	document.getElementById("fromCounty").value = fromCounty;
	document.getElementById("fromLat").value = fromLat;
	document.getElementById("fromLong").value = fromLong;
	document.getElementById("fromExcludedState").value = fromExcludedState;
	document.getElementById("fromStateFullName").value = fromStateFullName;
	document.getElementById("fromZipCount").value = fromZipCount;

	document.getElementById("toCity").value = toCity;
	document.getElementById("toState").value = toState;
	document.getElementById("toZip").value = toZip;
	document.getElementById("toZipGiven").value = toZipGiven;
	document.getElementById("toCounty").value = toCounty;
	document.getElementById("toLat").value = toLat;
	document.getElementById("toLong").value = toLong;
	document.getElementById("toExcludedState").value = toExcludedState;
	document.getElementById("toStateFullName").value = toStateFullName;
	document.getElementById("toZipCount").value = toZipCount;

	if (isMobile.any()) {
		setTimeout("$('#light').hide();", 6000);
		setTimeout("$('#fade').hide();", 6000);
	}

	document.getElementById("quoteform").submit();
}


/* ============================================================================
*  Utility function to return core values.
*  ========================================================================= */
function getLocationValues()
{
	var returnArray = new Array();
	returnArray['distance'] = totalD;
	returnArray['fromDni'] = fromDni;
	returnArray['toDni'] = toDni;
	returnArray['totalDni'] = totalDni;
	returnArray['from'] = from;
	returnArray['fromCity'] = fromCity;
	returnArray['fromState'] = fromState;
	returnArray['fromCounty'] = fromCounty;
	returnArray['fromZipGiven'] = fromZipGiven;
	returnArray['fromZip'] = fromZip;
	returnArray['fromLat'] = fromLat;
	returnArray['fromLong'] = fromLong;
	returnArray['fromExcludedState'] = fromExcludedState;
	returnArray['fromStateFullName'] = fromStateFullName;
	returnArray['fromZipCount'] = fromZipCount;
	returnArray['to'] = to;
	returnArray['toCity'] = toCity;
	returnArray['toState'] = toState;
	returnArray['toCounty'] = toCounty;
	returnArray['toZipGiven'] = toZipGiven;
	returnArray['toZip'] = toZip;
	returnArray['toLat'] = toLat;
	returnArray['toLong'] = toLong;
	returnArray['toExcludedState'] = toExcludedState;
	returnArray['toStateFullName'] = toStateFullName;
	returnArray['toZipCount'] = toZipCount;

	return returnArray;
}
