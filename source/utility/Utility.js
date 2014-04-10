/*****
File: Utility
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
String.prototype.toTitleCase = function(){
	var value = this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	return value;
};
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
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
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
