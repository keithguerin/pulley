/*****
File: Pulley.Utility
Notes: These utilities are used throughout the app, and provide shortcuts. This is not a class, because it would negate the purpose of the shortcuts.
*****/




//Shortcut to logs output to the browser, without errors for old browsers.
if(!window.console) {
	window.console = {
		log: function(){},
		debug: function(){},
		info: function(){},
		warn: function(){},
		error: function(){}
	};
}
function log(str){
	if(console) console.log(str);
}
function logMethod(instance, instanceMethodName, arguments){
	if(!__config) return;
	if(!__config.logging) return;
	//var argumentNames = getMethodArgumentNames(instanceMethod);
	var value = instance.toString()+'.'+instanceMethodName+'()';
	log(value);
	
	//Todo: Automatically determine the method name, and log it and its arguments. Unfortunately, this does not appear to be possible in Chrome right now.
	//var value = instance.toString()+'.'+getFunctionName(instanceMethodArguments.callee)+'()';
	/*for(var i in argumentNames){
		var argumentName = argumentNames[i];
		var argumentValue = instanceMethodArguments[i].toString();
		if(i > 0) value += ', ';
		value += argumentName+':'+argumentValue;
	}
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	function getMethodArgumentNames(method) {
		var fnStr = method.toString().replace(STRIP_COMMENTS, '')
		var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g)
		if(result === null)
			result = []
		return result
	}
	function getFunctionName(method) {
		var ret = method.toString();
		ret = ret.substr('function '.length);
		ret = ret.substr(0, ret.indexOf('('));
		return ret;
	}
	*/
}
function throwError(message){
	log('TERMINAL ERROR: '+message);
	//printStackTrace();//If this point is reached, you have found a an bug. Trace your call stack to locate it.
	nothing.nothing;//This throws a runtime error.
}


function registerNamespace(namespace){ //(String):void
	var namespaceParts = namespace.split('.');
	if(namespaceParts.length > 7) e.e; //Only 7 levels of depth are supported. Add more below if needed.
	var p0 = namespaceParts[0];
	var p1 = namespaceParts[1];
	var p2 = namespaceParts[2];
	var p3 = namespaceParts[3];
	var p4 = namespaceParts[4];
	var p5 = namespaceParts[5];
	var p6 = namespaceParts[6];
	for(var i in namespaceParts){
		i = eval(i);
		switch(i){
			case 0:
				if(!window[p0]){//If the namespace doesn't exist yet, create it.
					window[p0] = {};
				}
				break;
			case 1:
				if(!window[p0][p1]){
					window[p0][p1] = {};
				}
				break;
			case 2:
				if(!window[p0][p1][p2]){
					window[p0][p1][p2] = {};
				}
				break;
			case 3:
				if(!window[p0][p1][p2][p3]){
					window[p0][p1][p2][p3] = {};
				}
				break;
			case 4:
				if(!window[p0][p1][p2][p3][p4]){
					window[p0][p1][p2][p3][p4] = {};
				}
				break;
			case 5:
				if(!window[p0][p1][p2][p3][p4][p5]){
					window[p0][p1][p2][p3][p4][p5] = {};
				}
				break;
			case 6:
				if(!window[p0][p1][p2][p3][p4][p5][p6]){
					window[p0][p1][p2][p3][p4][p5][p6] = {};
				}
				break;
		}
	}
}

function isElementVisible(element){//(element):Boolean
	var coords = element.getBoundingClientRect();
	var isBelowView = (coords.top > window.innerHeight);
	var isAboveView = (coords.top + element.offsetHeight) < 0;
	var isElementOnScreen = !(isBelowView || isAboveView);
	var isVisible2 = $(element).is(":visible");
	var value = (isElementOnScreen && isVisible2);
	return value;
}




function radiansToDegrees(angleInRadians) {
	return angleInRadians * (180 / Math.PI);
}
function degreesToRadians(angleInDegrees) {
	return angleInDegrees * (Math.PI / 180);
}


function isString(object) { //(Object):Boolean
	var objectType = typeof object;
	var value = (objectType == 'string');
	return value;
}
function isPath(obj){
	if(isString(obj)){
		if(obj.indexOf('/') || obj.indexOf('#')){
			return true;
		}
	}
	return false;
}
/*function isNumber(value){//(Object):Boolean
	if((typeof value === "number") && Math.floor(value) === value){
		return true;
	}else{
		return false;
	}
}*/
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function randomNumber(max){
	var number = Math.floor(Math.random()*max);
	return number;
}
function randomPassword(length){
	if(!length) length = 8;
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	pass = "";
	for(x=0;x<length;x++){
		i = Math.floor(Math.random() * 62);
		pass += chars.charAt(i);
	}
	return pass;
}
function validateEmail(email){
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(email)) return false;
	return true;
}
String.prototype.toCamelCase = function(){
	//var value = str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
	var value = this.toLowerCase()
		.replace( /['"]/g, '' )
		.replace( /\W+/g, ' ' )
		.replace( / (.)/g, function($1) { return $1.toUpperCase(); })
		.replace( / /g, '' );
	return value;
}
String.prototype.toDashCase = function(){
	var original = this;
	var value = original.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
	//var value = original.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
	return value;
}
String.prototype.toTitleCase = function(){
	var value = this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	return value;
};
String.prototype.plural = function () {
	var lastChar = this.charAt(this.length);
	if (lastChar === 'y') {
		if ( (this.charAt(this.length - 2)).isVowel() ) {
			// If the y has a vowel before it (i.e. toys), then you just add the s. 
			return this + 's';
		}
		else {
			// If a this ends in y with a consonant before it (fly), you drop the y and add -ies to make it plural. 
			return this.slice(0, -1) + 'ies';
		}
	}
	else if (this.substring( this.length - 2) === 'us') {				
		// ends in us -> i, needs to preceed the generic 's' rule
		return this.slice(0, -2) + 'i'; 
	}
	else if (['ch', 'sh'].indexOf(this.substring( this.length - 2)) !== -1 || ['x','s'].indexOf(lastChar) !== -1) {
	 	// If a this ends in ch, sh, x, s, you add -es to make it plural.
		return this + 'es';
	}
	else {
		// anything else, just add s			
		return this + 's';
	}
}
function doesArrayContainValue(array, value){
	var i = array.length;
	while (i--) {
		if (array[i] == value) {
			return true;
		}
	}
	return false;
}

//Array.prototype.removeDuplicates = function(){ //This caused errors.
function removeDuplicatesFromArray(array){
	//Usage: myArray = removeDuplicates(myArray);
	//via http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript
	var a = array.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j]){
				a.splice(j--, 1);
			}
		}
	}
	return a
}

function removeObjectFromArray (object, array) {
	for(var i in array){
		var obj2 = array[i];
		if(obj2 == object){
			array.splice(i, 1);
		}
	}
}

function cleanArray(array, valueToDelete) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == valueToDelete) {         
			array.splice(i, 1);
			i--;
		}
	}
	return array;
};



function isFirefox(){
	if($.browser.mozilla){
		return true;
	}else{
		return false;
	}
}
function isTouchDevice(){
	//This cannot be abolutely determined. This ia just a good guess.
	var value = (isiOS() || isAndroid());
	return value;
}
function isAndroid(){
	var value = navigator.userAgent.toLowerCase().indexOf("android") > -1;
	return value;
}
function isiOS(){
	return (/iPhone|iPad|iPod/i.test(navigator.userAgent));
}
function isiPad(){
	return (/iPad/i.test(navigator.userAgent));
}
function isFirefox(){
	return (/Firefox/i.test(navigator.userAgent));
}
function isIE(){
	return (/MSIE/i.test(navigator.userAgent));
}
function isWindows(){
	log(navigator.platform);
	var indexOf = navigator.platform.toLowerCase().indexOf('win');
	if(indexOf >= 0){
		return true;
	}
	return false;
}
function isiPad(){
	var value = /ipad/i.test(navigator.userAgent.toLowerCase());
	return value;
}
function doesBrowserSupportPlaceholders(){
	var test = document.createElement('input');
	return ('placeholder' in test);
}
function addDeviceAndBrowserClassesTagsToBody(){
	var $body = $('body');
	if(isTheUserOnAPhone()){
		$body.addClass('mobile');
	}
	if(isiOS()){
		$body.addClass('iOS');
	}
	if(isiPad()){
		$body.addClass('iPad');
	}
	if(isFirefox()){
		$body.addClass('firefox');
	}
	if(isIE(11)){			
		$body.addClass('ie11');
	}
	if(isIE(10)){			
		$body.addClass('ie10');
	}
	if(isIE(9)){			
		$body.addClass('ie9');
	}
	if(isIE(8)){			
		$body.addClass('ie8');
	}
	if(isIE(7)){			
		$body.addClass('ie7');
	}
	if(isWindows()){
		$body.addClass('windows');
	}
}
function isTheUserOnAPhone(){
	var isPhoneUserAgent = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
	var windowWidth = $('body').width();
	//alert(windowWidth);
	var hasWidthOfPhone = (windowWidth < 768);
	if(hasWidthOfPhone) {
		return true;
	}else{
		return false;
	}
}
function isMobileDevice(){
	var value = jQuery.browser.mobile;//Uses the plug-in below.
	return value;
}
//Use special and escape characters in MySQL text fields, and then convert back using this function.
function replaceSpecialCharacters(str){
	//this.replace('\n', '');//line break
	str.replace('&#8226;', '•');//bullet
	//return this;
}




/* Cookies, via http://techpatterns.com/downloads/javascript_cookies.php */
function setCookie(name, value, expires, path, domain, secure){
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
function getCookie(check_name){
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
function Delete_Cookie( name, path, domain ) {
	if ( Get_Cookie( name ) ) document.cookie = name + "=" +
	( ( path ) ? ";path=" + path : "") +
	( ( domain ) ? ";domain=" + domain : "" ) +
	";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}
/* /Cookies */




function getURLVar(name) {
    var value = decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
	if(value == 'null'){
		value = null;
	}
	return value;
}



function disableUserScrolling(mouse, keyboard){
	//via http://stackoverflow.com/questions/11233586/is-it-possible-to-do-a-snap-to-effect-while-scrolling
	//and http://jsfiddle.net/rodneyrehm/aPvFL/
	if(mouse == null) mouse = true;
	if(keyboard == null) keyboard = true;
	if(mouse){
		$(document).bind('mousewheel DOMMouseScroll', function(event){
			event.preventDefault();
		});
	}
	if(keyboard){
		$(document).keydown(function(event){
			var deadKeyCodes = [
				37,38,39,40,//left, up, right, down
				16,//space
				33,34,//page up, page down
				35,36//end, home
			]
			for(var i in deadKeyCodes){
				var keyCode = deadKeyCodes[i];
				if(event.which == keyCode){
					event.preventDefault();
				}
			}
		});
	}
}

function bustCache(){
	var uniqueId = Math.round(new Date().getTime() / 1000);
	
	/* Todo: Is there a reasonable way to do this. The tags would need to be removed and re-added to the DOM.
	var scriptTags = $('script').toArray();
	//$scriptTags.each(function())
	for(var i in scriptTags){
		var scriptTag = scriptTags[i];
		scriptTag.src = styleTag.getAttribute('src') + '?' + uniqueId;
		//$(scriptTag).attr('src', )
	}
	*/
	
	var styleTags = $('link[rel="stylesheet"]').toArray();
	for(var i in styleTags){
		var styleTag = styleTags[i];
		styleTag.href = styleTag.getAttribute('href') + '?' + uniqueId;
	}
	
	var images = $('img').toArray();
	for(var i in images){
		var image = images[i];
		image.src = image.getAttribute('src') + '?' + uniqueId;
	}
	
}

function parsePath (path) { //(String):Array of Strings
	var pathParts = [];
	if(path){
		pathParts = path.split('/');
		pathParts = cleanArray(pathParts, '');
	}
	return pathParts;
}

function selectNavItemsBasedOnURL (useHash, rootPath, rootAlias){
	//First, find all automatically selected items and remove the selected class.
	var selectedFlag = 'data-selected-automatically';
	var automaticallySelectedItems = $('a['+selectedFlag+']').toArray();
	$(automaticallySelectedItems).removeClass('selected').removeAttr('data-selected-automatically');
	
	rootPath = normalizePath(rootPath);
	
	//Normalize the path.
	var path = useHash? window.location.hash : window.location.pathname;
	path = normalizePath(path);
	
	var allAnchors = $('a').toArray();
	var navItemsToSelect = [];
	for(var i in allAnchors){
		var anchor = allAnchors[i];
		var anchorPath = anchor.pathname;
		anchorPath = anchorPath.replace(rootPath, '');
		anchorPath = normalizePath(anchorPath);
		
		var isExternalLink = (anchor.origin != window.location.origin);
		if(!isExternalLink){
			//Does the anchor link to this exact path?
			var itsAMatch = (anchorPath == path);
			if(path == '/'){
				if(anchorPath == rootAlias){
					itsAMatch = true;
				}
			}

			//Does the anchor link to a parent of the path, that has the data attribute telling it to be selected?
			var selectIfChildIsSelected = doesElementHaveAttribute(anchor, 'data-select-if-child-is-selected'); //Add this flag to any anchors that you want to be selected if a child state is selected, such as a main nav.
			var isChildMatch = (path.indexOf(anchorPath) > -1);
			if(itsAMatch || isChildMatch && selectIfChildIsSelected){
				navItemsToSelect.push(anchor);
			}
		}
	}
	
	//Select the items, and flag them for later removal.
	$(navItemsToSelect).addClass('selected').attr(selectedFlag, '');
}

//Normalize paths by removing hash symbols and trailing slash. A normalized URL looks like "/users/adam".
function normalizePath (path, rootURL) {
	if(rootURL && rootURL != '/'){
		path = path.replace(rootURL, '');
	}
	if(path.indexOf('//') > -1){
		console.error('The origin must be removed. Patth in the rootURL to remove it.')
	}
	path = path.toLowerCase();
	//Remove leading # or /#
	if(path.charAt(0) == '#'){
		path = path.substring(1);
	}
	if(path.substring(0,2) == '/#'){
		path = path.substring(2);
	}
	//Add a leading slash.
	if(path.charAt(0) != '/'){
		path = '/' + path;
	}
	//Remove trailing slash
	if(path.charAt(path.length-1) == '/' && path.length > 1){
		path = path.substring(0, path.length-1);
	}
	return path;
}

function doesElementHaveAttribute(element, attribute){
	var attributeValue = $(element).attr(attribute);
	var result = (attributeValue !== undefined);
	return result;
}



function initializeNestedAnchors(){
	//Nested anchors are invalid HTML. However it can be done using JavaScript. Just make tags like this:
	//<a2 href='#' target='#'>Nested anchor</a2>
	var nestedAnchors = $('a2').toArray();
	$(nestedAnchors).bind('click', function(event){
		var href = event.target.getAttribute('href');
		var target = event.target.getAttribute('target');
		if(!target) target = '_self';
		window.open(href, target);
	});
}

function retinafyImages(){
	//Find all images with class .retina, and resize them to half of their actual size on load (or if already loaded).
	//This is easier & cleaner than maintaining manual width='' and height='' tags in html.
	var retinaImages = $('img.retina').toArray();
	for(var i in retinaImages){
		var image = retinaImages[i];
		var hasDefinedWidth = image.getAttribute('width');
		var hasDefinedHeight = image.getAttribute('height');
		var hasDefinedSize = (hasDefinedWidth || hasDefinedHeight);
		if(!hasDefinedSize){
			if(isImageLoaded(image)){
				shrinkIt(image);
			}else{
				onImageProgress(image, shinkItCallback);
				onImageLoaded(image, shinkItCallback);
			}
		}
	}
	
	function shinkItCallback(image){	
		shrinkIt(image);
	}
	
	function shrinkIt(image){
		image.width = image.naturalWidth / 2;
		image.height = image.naturalHeight / 2;
	}
}

function isImageLoaded(img){
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}
function onImageProgress(image, callback){
	var imageLoadWatcher = imagesLoaded(image); //Uses http://desandro.github.io/imagesloaded/
	imageLoadWatcher.on( 'progress', function( instance, image2 ) {
		var result = image2.isLoaded ? 'loaded' : 'broken';
		//console.log( 'image is ' + result + ' for ' + image2.img.src );
		callback(image);
	});
}
function onImageLoaded(image, callback){ //(:imgElement, :function) :void
	var imageLoadWatcher = imagesLoaded(image); //Uses http://desandro.github.io/imagesloaded/
	imageLoadWatcher.on( 'done', function( instance ) {
		callback(image);
	});
	
	/*$(image).load(function() {
		callback(image);
	});*/
	/*var uniqueId = Math.round(new Date().getTime() / 1000);
	var src = image.getAttribute('src');
	var delimiter = '?'
	if(src.indexOf('?') > -1){
		delimiter = '&';
	}
	var newSrc = src + delimiter + uniqueId;
	image.setAttribute('src', newSrc);*/
}

//Find all images with an SVG source, and change the file extension to .png
function fallbackFromSVGsToPNGs(){
	var browserSupportsSVG = Modernizr.svg;
	if(browserSupportsSVG){
		return;
	}
	var allImagesWithSVGSource = $('img[src*=".svg"]').toArray();
	for(var i in allImagesWithSVGSource){
		var image = allImagesWithSVGSource[i];
		var source = image.src;
		var newSource = source.substring(0, source.indexOf('.svg')) + '.png';
		image.src = newSource;
	}
}


//requestAnimationFrame shim via http://stackoverflow.com/questions/17000394/requestanimationframe-not-available-in-safari-how-to-do-fluid-animations
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      },
      timeToCall);
      lastTime = currTime + timeToCall;
      return id;
  };
  if(!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
  };
}());



//This is an abstraction of Google Analytics event tracking.
//https://developers.google.com/analytics/devguides/collection/analyticsjs/events
function track(targetObject, eventType){ //e.g.
	var category = targetObject; //__config.googleAnalytics_category;
	var action = eventType; //targetObject + '_' + eventType;
	//var label = __config.landingPageId
	ga('send', 'event', category, action); //, label);
}



//This is a wrapper for jQuery's ajax call. It helps keep code short, clean, consistent, and includes all neccessary parameters.
function ajax(params){
	var method = params.method? params.method : 'get';
	var dataType = params.dataType? params.dataType : 'json';
	var timeout = __config.ajaxTimeout? __config.ajaxTimeout : 10000;
	$.ajax({
		url: params.url,
		method: method,
		data: params.data,
		dataType: dataType,//We are using JSON-P to allow cross-domain AJAX requests. http://stackoverflow.com/questions/3506208/jquery-ajax-cross-domain
		timeout: timeout,//Allows errors to be handled, since JSON-P does not return errors.
		notmodified:function(data){},
		timeout:function(data){},
		abort:function(data){},
		parseerror:function(data){},
		complete:function(data){},
		error: function(jqxhr, textStatus, errorThrown){
			if(params.error) params.error(arguments);
		},
		success: function(data, textStatus, jqxhr) {
			if(data.success){
				if(params.success) params.success(data, textStatus, jqxhr);
			}else{
				if(params.error) params.error(arguments);
			}
		}
	});
}




var __elementLocks = [];//Array of items that are transitioning. Do not edit directly.
function lockElement(element){
	for(var i in __elementLocks){
		if(element == __elementLocks[i]){
			return;//Already locked.
		}
	}
	__elementLocks.push(element);
}
function unlockElement(element){
	for(var i in __elementLocks){
		if(element == __elementLocks[i]){
			__elementLocks.splice(i, 1);
			return true;//Found and removed items.
		}
	}
	return false;//Item not found.
}
function isElementLocked(element){
	for(var i in __elementLocks){
		if(element == __elementLocks[i]){
			return true;
		}
	}
	return false;
}

