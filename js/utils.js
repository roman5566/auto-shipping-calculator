(function() {
    if (!window.console) {
        window.console = {};
    }
    /* union of Chrome, FF, IE, and Safari console methods */
    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];
    /* define undefined methods as noops to prevent errors */
    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
            window.console[m[i]] = function() {};
        }
    }
})();

/* ============================================================================
*  Makes the first letter of every word capitalized.
*  ========================================================================= */
String.prototype.ucfirst = function(){ return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } ); };


/* ============================================================================
*  When moving text from an innerHTML, it does not decode special chars. This
*  function is to overcome that annoying 'feature'.
*  ========================================================================= */
String.prototype.decodeHTML = function() { return this.replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>').replace(/\&quot\;/g, '"').replace(/\&amp\;/g, '&').replace(/\&nbsp\;/g, ' '); }


/* ============================================================================
*  Trims off white space. Easy.
*  ========================================================================= */
String.prototype.trim = function() { return this.replace(/^\s*/, "").replace(/\s*$/, ""); }


/* ============================================================================
*  Searches an array to see if a given value exists.
*  NOTE: Adding prototype function to Arrays will impact for..in loops, which
*  will iterate including the prototype functions.
*  ========================================================================= */
//Array.prototype.exists = function(search)
//{
//	for (var i=0; i<this.length; i++) if (this[i] == search) return true;
//	return false;
//}


/* ============================================================================
*  Searches an array to see if a given value exists. Returns index. Returns -1
*  if a match is not found.
*  ========================================================================= */
function array_search(inArr, inSearch)
{
	if (inArr != null && inSearch != null && inSearch != "")
		for (var i = 0; i < inArr.length; i++)
			if (inArr[i] == inSearch)
				return i;
	return -1;
}


/* ============================================================================
*  To reset the state options back to default, or zeroed values.
*  ========================================================================= */
function resetSelection(selectElement, firstSelection)
{
	selectElement.options[0] = new Option();
	// selectObject.length = 1;	// Another way to get a new option;
	selectElement.options[0].value = "";

	if (firstSelection != null) selectElement.options[0].text = firstSelection;
	else selectElement.options[0].text = "Select One";

	selectElement.length = 1;	// Truncate old options.

	selectElement.selectedIndex = 0;
}


/* ============================================================================
*  Called by HTML, when creating a Select element that needs to populate the
*  option elements with the given string array. The array parameter is used to
*  create the Select Option elements. If the array is a simple array, it will
*  use each array element for both the Select text and Select value. However,
*  if the array element is another array, it will assume that the first element
*  of the child array is the Select text and the second element is the Select
*  value. If the useChildValAsKey is set to true, and there exists child arrays
*  in the array parameter, it will always use the first element of the child
*  array as both the Select text and Select value.
*  ========================================================================= */
function fillSelection(selectElement, inArray, useChildValAsText)
{
	//alert("Inside fillSelection.");

	if (useChildValAsText == null) useChildValAsText = false;

	// First clear out the old array
	// resetSelection(selectElement, null);
	var counter = 1;

	// Populate the selection options!
	for(var j = 0; j < inArray.length; j++)
	{
		selectElement.options[counter] = new Option();

		var value = inArray[j];

		if (inArray[j] instanceof Array)
		{
			if (useChildValAsText) selectElement.options[counter].text = inArray[j][1];
			else selectElement.options[counter].text = inArray[j][0];

			selectElement.options[counter].value = inArray[j][1];
		}
		else
		{
			selectElement.options[counter].text = inArray[j]
			selectElement.options[counter].value = inArray[j]
		}

		counter++;
	}
}


/* ============================================================================
*  To find and set the Select element to have a particular option selected.
*  ========================================================================= */
function selectOption(selectElement, selectOption)
{
	if (selectElement != null && selectElement.options != null && selectOption != null)
		for (var j = 0; j < selectElement.options.length; j++)
		{
			if (selectElement.options[j].text == selectOption)
			{
				selectElement.options[j].selected = true;
				break;
			}
		}
}


/* ============================================================================
*  To find and set the Select element to have a particular option selected.
*  ========================================================================= */
function selectOptionByValue(selectElement, selectOption)
{
	if (selectElement != null && selectElement.options != null && selectOption != null)
		for (var j = 0; j < selectElement.options.length; j++)
		{
			if (selectElement.options[j].value == selectOption)
			{
				selectElement.options[j].selected = true;
				break;
			}
		}
}

/* ============================================================================
*  Copy the selected value from one selection menu to another.
*  ========================================================================= */
function selectTransferSelection(oldSelect, newSelect)
{
	newSelect.selectedIndex = oldSelect.selectedIndex;
	//alert("Copying over newSelect.selectedIndex["+newSelect.selectedIndex+"]");
	if (!newSelect.options[newSelect.selectedIndex].selected) newSelect.options[newSelect.selectedIndex].selected=true;	// Odd, but sometimes this is needed, in addition to above.
}

/* ============================================================================
*  Sets a cookie
*  ========================================================================= */
function Set_Cookie( name, value, expires, path, domain, secure )
{
	// set time, it's in milliseconds
	var today = new Date();
	today.setTime( today.getTime() );

	/*
	if the expires variable is set, make the correct
	expires time, the current script below will set
	it for x number of days, to make it for hours,
	delete * 24, for minutes, delete * 60 * 24
	*/
	if ( expires )
	{
	expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );

	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
	( ( path ) ? ";path=" + path : "" ) +
	( ( domain ) ? ";domain=" + domain : "" ) +
	( ( secure ) ? ";secure" : "" );
}

/* ============================================================================
*  Gets a cookie
*  ========================================================================= */
function Get_Cookie( check_name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f

	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );


		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

		// if the extracted name matches passed check_name
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return null;
	}
}

function checkZipCode(page, zipCode, id)
{
	$.ajax({
		url: page,
		data: 'ajax=checkZipCode&zipCode=' + zipCode,
		dataType: 'json',
		success: function(response)
		{
			if (response == '1')
			{
				$('#' + id).css({'background-color' : '#fff'});
				$('#' + id + 'Error').css({ 'display' : 'none' });
				$('#' + id + 'Error .message-holder').html('');
			}
			else
			{
				$('#' + id).css({'background-color' : '#faafaf'});
				$('#' + id + 'Error .message-holder').html('The zipcode you entered was not found in our database !');
				$('#' + id + 'Error').css({
					'display' : 'block',
					'z-index' : 100000
				});

				var height = $('#' + id + 'Error').height();

				$('#' + id + 'Error').css({
					'top' : $('#' + id).offset().top - height,
					'left' : $('#' + id).offset().left
				});

				$(window).resize(function(){
					$('#' + id + 'Error').css({
						'top' : $('#' + id).offset().top - height,
						'left' : $('#' + id).offset().left
					});
				});
			}
		}
	});
}

var t;
var t1;
var city;
var city_id;
var state;
var cities = [];
var cache_array = [];

function lookup_with_states(id, page, like)
{
	if (like == null)
	{
		like = 0;
	}

	cities = [];

	city_id = '#' + id;
	var city_state = $(city_id).val();
	var id_arr = city_state.split(',');

	if (id_arr.length > 1)
	{
		city = id_arr[0];
		var state = id_arr[1];
	}
	else
	{
		city = $(city_id).val();
		var state = "";
	}

	clearTimeout(t);
	t = setTimeout(function() { showAutocomplete(page, like); }, 150);
	//showAutocomplete(page, like);
}

function showAutocomplete(page, like)
{
	if (!city.match('^[0-9]+$') && city.length > 2)
	{
		$.ajax({
			type: 'POST',
			url: page,
			data: 'ajax=getCitiesWithStates&city=' + city + '&like=' + like,
			dataType: 'json',
			async: false,
			success: function(response)
			{
				if(response.length > 0 && response[0].error == undefined)
				{
					$(city_id).css({'background' : '#FFF'});

					$.each(response, function(ind, val)	{
						if (val['city'] != undefined && val['city'] != '')
							cities.push(val['city'] + ', ' + val['state']);
					});

					//cache_array = cities;
				}
				else
				{
					$(city_id).css({'background' : '#FAAFAF'});
				}
			}
		});
	}
	else if (city.match('^[0-9]+$') && city.length > 5)
	{
		$(city_id).css({'background' : '#FAAFAF'});
	}
	else
	{
		$(city_id).css({'background' : '#FFF'});
	}

	/*
	if (cache_array.length > 0  && city.length > 2)
	{
		cities = cache_array;
	}
	*/

	$(city_id).autocomplete({
		source: cities,
		minLength: 0
	});

	//if (cache_array.length > 0 && city.length > 2)
	{
		$(city_id).autocomplete('search', '');
	}


	$('.ui-autocomplete').css({ 'width' : '205' });
}

var zip_id;
var zipcode;
function lookup_with_states_by_zip(id, page, show_autocomplete)
{
	cities = [];

	zip_id = '#' + id;
	zipcode = $(zip_id).val();

	clearTimeout(t1);
	t1 = setTimeout(function() { showAutocompleteByZip(page); }, 100);
	//showAutocompleteByZip(page, show_autocomplete);
}

function showAutocompleteByZip(page)
{
	if (zipcode.length == 5)
	{
		$.ajax({
			type: 'POST',
			url: page,
			data: 'ajax=getCitiesWithStatesByZip&zipcode=' + zipcode,
			dataType: 'json',
			async: false,
			success: function(response)
			{
				if(response.length > 0)
				{
					//if (show_autocomplete)
					{
						$(zip_id).css({'background' : '#FFF'});

						$.each(response, function(ind, val)	{
							if (val['city'] != undefined && val['city'] != '')
								cities.push(val['city'] + ', ' + val['state'] + ' ' + val['zipcode']);
						});
					}
				}
				else
				{
					cities = [];
					$(zip_id).css({'background' : '#FAAFAF'});
				}
			}
		});
	}
	else if (zipcode.match('^[0-9]+$') && zipcode.length > 5)
	{
		$(zip_id).css({'background' : '#FAAFAF'});
	}
	else
	{
		$(zip_id).css({'background' : '#FFF'});
	}

	$(zip_id).autocomplete({
		source: cities,
		minLength: 0
	});

	if (zipcode.length == 5)
	{
		$(zip_id).autocomplete('search', '');
	}
	else
	{
		$(zip_id).autocomplete('close');
	}

	$('.ui-autocomplete').css({ 'width' : '205' });

}

function lookup_by_state_code (jq_id, city, state_code, zip_code, page, states_like)
{
	var dataParams = 'ajax=getCitiesByStateCode&states_like=' + states_like + '&city=' + city;

	if (state_code != 'undefined')
	{
		dataParams = dataParams + '&state_code=' + state_code;
	}

	if (zip_code != 'undefined')
	{
		dataParams = dataParams + '&zip_code=' + zip_code;
	}

	$.ajax({
		url: page,
		data: dataParams,
		dataType: 'json',
		success: function(response)
		{
			if (response.length == 0)
			{
				$(jq_id).css({'background' : '#FAAFAF'});
			}
			else
			{
				$(jq_id).css({'background' : '#FFF'});
			}
		}
	});
}

function autocomplete_cities(id, page, like, keyPressed, frontend)
{
	//frontend - is the request coming from the website or the external calc
	//1 - website; 0 - external calc
	var val = $('#' + id).val();

	if (val != 'Zip -OR- City, State' && val != 'City, State' && val != '')
	{
		var nums = val.match('^[0-9]+$');
		if (nums)
		{
			like = 0;
		}

		$('#' + id)
		.autocomplete({
			source: function(req, responseFn) {
				if (req.term != 'Zip -OR- City, State' && req.term != 'City, State' && req.term != '')
				{
					$.ajax({
						url: page,
						type: 'POST',
						data: 'ajax=getCitiesWithStates&query=' + req.term + '&like=' + like,
						dataType: 'json',
						async: true,
						success: function(response)
						{
							var err = 0;
							if (response.length > 0)
							{
								if (response.error != undefined || err == 1)
					            {
					            	$('#' + id).css({'background-color' : '#FAAFAF'});
					            }
					            else
					            {
					            	$('#' + id).css({'background-color' : '#FFF'});
					            }
							}
							else
							{
								$('#' + id).css({'background-color' : '#FAAFAF'});
							}

							responseFn( $.map( response, function( item ) {
								if (item.error)
								{
									err = 1;
									$('#' + id).css({'background-color' : '#FAAFAF'});
									return item.error;
								}
								else
								{
									val_to_bold = item.city + ', ' + item.state;
									val_with_zip = item.zipcode;
									if (response[0].closest != undefined)
									{
										return {label: __highlight(val_to_bold, response[0].closest), value: val_to_bold, id: val_with_zip};
									}
									else
									{
										if (frontend != 0 && !isNaN(parseInt(req.term)))
										{
											return {label: val_to_bold + ' ' + val_with_zip, id: val_with_zip};
										}
										else
										{
											return {label: val_to_bold, id: val_with_zip};
										}

									}
								}
	                        }));
						}
					});
				}
				else
				{
					$('#' + id).autocomplete('destroy');
				}
			},
			select: function(event, ui) {
				$('#' + id).css({'background-color' : '#FFF'});
				if($('#' + id + 'Hidden').length > 0 )
				{
					$('#' + id + 'Hidden').val(ui.item.id);
				}
			},
			minLength: 3,
			open: function() {
				$('.ui-autocomplete').width($('#' + id).width());
			}
		})
		.data( "autocomplete" )._renderItem = function( ul, item ) {
			if (item.value == 'Closest matches:' || item.value == 'No matches found! Please, try again')
			{

			    return $('<li class="ui-menu-item disabled"></li>')
			    	.data("item.autocomplete", item)
			    	.append('<span>'+item.value+'</span>')
			    	.appendTo(ul);
			}
			else
			{
              // only change here was to replace .text() with .html()
              return $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append( $( "<a></a>" ).html(item.label) )
                    .appendTo( ul );
			}
        };
	}
	else
	{
		$('#' + id).css({'background-color' : '#FFF'});
	}

	$(window).resize(function(){
		var autocompletes = $('.ui-autocomplete');
		$.each(autocompletes, function(ind, item){
			if (item.style.display == 'block')
			{
				var off = $('#' + id).offset();
				item.style.left = off.left + 'px';
				item.style.top = off.top + 23 + 'px';
			}
		});
	});
}



function __highlight(s, t) {
	  var matcher = new RegExp("("+$.ui.autocomplete.escapeRegex(t)+")", "ig" );
	  return s.replace(matcher, "<strong style='color: #f00;'>$1</strong>");
	}

function autocomplete_results(id, page, blur, states_like)
{
	//blur - is the request coming from a blur event
	//states_like - should the sql query be "LIKE 'city%'" or "= city"
	var jq_id = '#' + id;
	var val = $(jq_id).val();

	if ($(jq_id).val().length >= 2 && $(jq_id).val() != 'Zip -OR- City, State' && $(jq_id).val() != 'City, State' && $(jq_id).val() != '')
	{
		var nums = $(jq_id).val().match('^[0-9]+$');

		if (nums)
		{
			$(jq_id).attr('maxlength', '5');
			lookup_with_states_by_zip(id, page, states_like);
		}
		else if (val.indexOf(',') == -1)
		{
			$(jq_id).attr('maxlength', '255');
			lookup_with_states(id, page, blur);
		}
		else if (val.indexOf(',') != -1)
		{
			var exec_func = true;

			$(jq_id).attr('maxlength', '255');
			var val_arr = val.split(',');
			var city = val_arr[0];
			var val_1 = $.trim(val_arr[1]);
			var val_2 = val_1.split(' ');

			if (val_2.length > 2 || val_2.length == 0)
			{
				exec_func = false;
			}
			else if (val_2.length == 1)
			{
				if (val_2[0].match(/^\w{2}$/) && !val_2[0].match(/^\d{2}$/))
				{
					var state_code = val_2[0];
				}
				else if (val_2[0].match(/\d/))
				{
					var zip_code = val_2[0];
				}
			}
			else if (val_2.length == 2)
			{
				if (val_2[0].match(/^\w{2}$/) && !val_2[0].match(/^\d{2}$/))
				{
					var state_code = val_2[0];
					if (val_2[1].match(/\d/))
					{
						var zip_code = val_2[1];
					}
				}
				else if (val_2[0].match(/\d/))
				{
					var zip_code = val_2[0];
					if (val_2[1].match(/^\w{2}$/))
					{
						var state_code = val_2[1];
					}
					else
					{
						exec_func = false;
					}
				}
				else
				{
					exec_func = false;
				}
			}

			if (exec_func)
			{
				lookup_by_state_code(jq_id, city, state_code, zip_code, page, blur);
			}
			else
			{
				$(jq_id).css({'background' : '#FAAFAF'});
			}
		}
	}
	else
	{
		$(jq_id).css({'background' : '#FAAFAF'});
		$(jq_id).autocomplete('destroy');
	}
}

function createCookie(name,value,days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+value+expires+"; path=/; domain=."+location.host;
}

function html_entity_decode( string, quote_style ) {
    // Convert all HTML entities to their applicable characters
    //
    // version: 901.714
    // discuss at: http://phpjs.org/functions/html_entity_decode
    // +   original by: john (http://www.jd-tech.net)
    // +      input by: ger
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: marc andreu
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: get_html_translation_table
    // *     example 1: html_entity_decode('Kevin &amp; van Zonneveld');
    // *     returns 1: 'Kevin & van Zonneveld'
    // *     example 2: html_entity_decode('&amp;lt;');
    // *     returns 2: '&lt;'
    var histogram = {}, symbol = '', tmp_str = '', entity = '';
    tmp_str = string.toString();

    if (false === (histogram = get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }

    // &amp; must be the last character when decoding!
    delete(histogram['&']);
    histogram['&'] = '&amp;';

    for (symbol in histogram) {
        entity = histogram[symbol];
        tmp_str = tmp_str.split(entity).join(symbol);
    }

    return tmp_str;
}

function get_html_translation_table (table, quote_style) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Philip Peterson
	  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: noname
	  // +   bugfixed by: Alex
	  // +   bugfixed by: Marco
	  // +   bugfixed by: madipta
	  // +   improved by: KELAN
	  // +   improved by: Brett Zamir (http://brett-zamir.me)
	  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
	  // +      input by: Frank Forte
	  // +   bugfixed by: T.Wild
	  // +      input by: Ratheous
	  // %          note: It has been decided that we're not going to add global
	  // %          note: dependencies to php.js, meaning the constants are not
	  // %          note: real constants, but strings instead. Integers are also supported if someone
	  // %          note: chooses to create the constants themselves.
	  // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
	  // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
	  var entities = {},
	    hash_map = {},
	    decimal;
	  var constMappingTable = {},
	    constMappingQuoteStyle = {};
	  var useTable = {},
	    useQuoteStyle = {};

	  // Translate arguments
	  constMappingTable[0] = 'HTML_SPECIALCHARS';
	  constMappingTable[1] = 'HTML_ENTITIES';
	  constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
	  constMappingQuoteStyle[2] = 'ENT_COMPAT';
	  constMappingQuoteStyle[3] = 'ENT_QUOTES';

	  useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
	  useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

	  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
	    throw new Error("Table: " + useTable + ' not supported');
	    // return false;
	  }

	  entities['38'] = '&amp;';
	  if (useTable === 'HTML_ENTITIES') {
	    entities['160'] = '&nbsp;';
	    entities['161'] = '&iexcl;';
	    entities['162'] = '&cent;';
	    entities['163'] = '&pound;';
	    entities['164'] = '&curren;';
	    entities['165'] = '&yen;';
	    entities['166'] = '&brvbar;';
	    entities['167'] = '&sect;';
	    entities['168'] = '&uml;';
	    entities['169'] = '&copy;';
	    entities['170'] = '&ordf;';
	    entities['171'] = '&laquo;';
	    entities['172'] = '&not;';
	    entities['173'] = '&shy;';
	    entities['174'] = '&reg;';
	    entities['175'] = '&macr;';
	    entities['176'] = '&deg;';
	    entities['177'] = '&plusmn;';
	    entities['178'] = '&sup2;';
	    entities['179'] = '&sup3;';
	    entities['180'] = '&acute;';
	    entities['181'] = '&micro;';
	    entities['182'] = '&para;';
	    entities['183'] = '&middot;';
	    entities['184'] = '&cedil;';
	    entities['185'] = '&sup1;';
	    entities['186'] = '&ordm;';
	    entities['187'] = '&raquo;';
	    entities['188'] = '&frac14;';
	    entities['189'] = '&frac12;';
	    entities['190'] = '&frac34;';
	    entities['191'] = '&iquest;';
	    entities['192'] = '&Agrave;';
	    entities['193'] = '&Aacute;';
	    entities['194'] = '&Acirc;';
	    entities['195'] = '&Atilde;';
	    entities['196'] = '&Auml;';
	    entities['197'] = '&Aring;';
	    entities['198'] = '&AElig;';
	    entities['199'] = '&Ccedil;';
	    entities['200'] = '&Egrave;';
	    entities['201'] = '&Eacute;';
	    entities['202'] = '&Ecirc;';
	    entities['203'] = '&Euml;';
	    entities['204'] = '&Igrave;';
	    entities['205'] = '&Iacute;';
	    entities['206'] = '&Icirc;';
	    entities['207'] = '&Iuml;';
	    entities['208'] = '&ETH;';
	    entities['209'] = '&Ntilde;';
	    entities['210'] = '&Ograve;';
	    entities['211'] = '&Oacute;';
	    entities['212'] = '&Ocirc;';
	    entities['213'] = '&Otilde;';
	    entities['214'] = '&Ouml;';
	    entities['215'] = '&times;';
	    entities['216'] = '&Oslash;';
	    entities['217'] = '&Ugrave;';
	    entities['218'] = '&Uacute;';
	    entities['219'] = '&Ucirc;';
	    entities['220'] = '&Uuml;';
	    entities['221'] = '&Yacute;';
	    entities['222'] = '&THORN;';
	    entities['223'] = '&szlig;';
	    entities['224'] = '&agrave;';
	    entities['225'] = '&aacute;';
	    entities['226'] = '&acirc;';
	    entities['227'] = '&atilde;';
	    entities['228'] = '&auml;';
	    entities['229'] = '&aring;';
	    entities['230'] = '&aelig;';
	    entities['231'] = '&ccedil;';
	    entities['232'] = '&egrave;';
	    entities['233'] = '&eacute;';
	    entities['234'] = '&ecirc;';
	    entities['235'] = '&euml;';
	    entities['236'] = '&igrave;';
	    entities['237'] = '&iacute;';
	    entities['238'] = '&icirc;';
	    entities['239'] = '&iuml;';
	    entities['240'] = '&eth;';
	    entities['241'] = '&ntilde;';
	    entities['242'] = '&ograve;';
	    entities['243'] = '&oacute;';
	    entities['244'] = '&ocirc;';
	    entities['245'] = '&otilde;';
	    entities['246'] = '&ouml;';
	    entities['247'] = '&divide;';
	    entities['248'] = '&oslash;';
	    entities['249'] = '&ugrave;';
	    entities['250'] = '&uacute;';
	    entities['251'] = '&ucirc;';
	    entities['252'] = '&uuml;';
	    entities['253'] = '&yacute;';
	    entities['254'] = '&thorn;';
	    entities['255'] = '&yuml;';
	  }

	  if (useQuoteStyle !== 'ENT_NOQUOTES') {
	    entities['34'] = '&quot;';
	  }
	  if (useQuoteStyle === 'ENT_QUOTES') {
	    entities['39'] = '&#39;';
	  }
	  entities['60'] = '&lt;';
	  entities['62'] = '&gt;';


	  // ascii decimals to real symbols
	  for (decimal in entities) {
	    if (entities.hasOwnProperty(decimal)) {
	      hash_map[String.fromCharCode(decimal)] = entities[decimal];
	    }
	  }

	  return hash_map;
	}

function rgbToHEX(rgbString)
{
	var ie = rgbString.indexOf('rgb');

	if (ie != -1)
	{
		var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

		delete (parts[0]);
		for (var i = 1; i <= 3; ++i) {
		    parts[i] = parseInt(parts[i]).toString(16);
		    if (parts[i].length == 1) parts[i] = '0' + parts[i];
		}
		var hexString ='#'+parts.join('').toUpperCase();

		return hexString;
	}
	else
	{
		return rgbString;
	}
}

function setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);

    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

function setGreyAndCaretAtPos(id, pos, static_text)
{
	var jid = '#' + id;
	if ($(jid).val() == static_text)
	{
		$(jid).css({ 'color' : '#aaa' });
		setCaretPosition(id, pos);
	}
}

function LoadMyJs(scriptName)
{
	var docHeadObj = document.getElementsByTagName("head")[0];
	var dynamicScript = document.createElement("script");
	dynamicScript.type = "text/javascript";
	dynamicScript.src = scriptName;
	docHeadObj.appendChild(newScript);
}

function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android|Nexus/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry|RIM/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function fillPredefinedText(sTextID, sFieldID, sPrevTextSeparator, bHideAfterUse) {
	var sReason = $('#'+sFieldID).val();
	if (sReason != '')
		sReason += sPrevTextSeparator;
	sReason += $('#'+sTextID).html();

	$('#'+sFieldID).val(sReason);

	if (typeof(bHideAfterUse) != 'undefined' && bHideAfterUse) {
		$('#'+sTextID).hide();
	}
}

var $reviewCenterHolder = null;
function variousCustomFancyBox()
{
	var isItMobile = isMobile.any();
	$(".various-custom").fancybox({
		type		: 'iframe',
		maxWidth	: isItMobile?$(document).width() - 130:1000,
		maxHeight	: isItMobile?$(document).height():600,
		fitToView	: false,
		width		: isItMobile?'100%':'70%',
		height		: isItMobile?'100%':'70%',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		afterLoad	: function(e) {
			if(e.href.indexOf('reviewcentre.com') >= 0) {
				$(e.content[0]).css({'overflow':'hidden','height':'4500px'});
				$(e.content[0]).attr('scrolling', 'no');
				$reviewCenterHolder = $($(e.content[0]).parent()[0]);
				$($(e.content[0]).parent()[0]).css({'overflow':'scroll'});
				setTimeout(function(){ $reviewCenterHolder.scrollTop(690); }, 100);
			}
		}
	});
}

function setCookie(sCookie, mValue, iExpireMinutes, sPath) {
	var oExpDate = new Date();
		oExpDate.setTime(oExpDate.getTime() + iExpireMinutes*60*1000);
		document.cookie = sCookie+'='+
		(mValue == null ? '1' : encodeURI(mValue))+
		(iExpireMinutes == null ? '' : ';expires='+oExpDate.toUTCString())+
		(sPath == null ? '' : ';path='+sPath);
}

function htmlspecialchars(string) {
	return $('<span>').text(string).html();
}

/* Track outbound links with Google Analytics */
$(function() {
    if (typeof _track_outbound_links !== 'undefined' && parseInt(_track_outbound_links)) {
        $('a[data-link="outbound"]').click(function () {
            ga('send', 'event', 'outbound', 'click', this.href);
        });
    }
});