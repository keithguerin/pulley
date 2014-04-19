/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	
	// The base Class implementation (does nothing)
	this.Class = function(){};
	this.Class.prototype = new $();//Keith: I extended the jQuery object, so we can treat ViewControllers as views directly.
	
	// Create a new Class that inherits from this class
	Class.extend = function(prop) {
		var _super = this.prototype;
	
		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		
		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn){
				return function() {
				var tmp = this._super;
			
				// Add a new ._super() method that is the same method
				// but on the super-class
				this._super = _super[name];
			
				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				var ret = fn.apply(this, arguments);		
				this._super = tmp;
			
				return ret;
				};
			})(name, prop[name]) :
			prop[name];
		}
	
		// The dummy class constructor
		function Class($scope, $element) {
			var args = arguments;
			this.initializedByAngular = null;//Determine if this instance is being initiated via AngularJS.
			if($scope){
				if($scope.$id){
					this.initializedByAngular = true;
				}
			}
			// All construction is actually done in the init method
			if ( !initializing && this.init )
			this.init.apply(this, arguments);
		}
	
		// Populate our constructed prototype object
		Class.prototype = prototype;
	
		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;
	 
		// And make this class extendable
		Class.extend = arguments.callee;
	
		return Class;
	};
})();

/* **********************************************
     Begin controller.js
********************************************** */

//DEFINE PULLEY APPLICATION NAMESPACE
if(!window.pulley){
	window.pulley = {
		model:{
			valueobjects:{}
		},
		view:{
			controls:{}
		}
	}
}

/*****
Class: Controller
Extends: Class
Notes: All classes should extend this class. It adds additional methods that are needed throughout the app.
*****/

pulley.Controller = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(initObj){
		
		this.type = this.type;//Assign static var to instance.
		this.type_ = this.type.substr(this.type.lastIndexOf('.')+1);
		
		//Copy values from the initObj to this.
		for(var attr in initObj){//Initialize with an object (including API-served JSON)
			var value = initObj[attr];
			/*if(property instanceof Array){//Is this needed?
				value = Foo.convertArrayOfJSONObjectsToJavaScriptObjects(value);
			}*/
			this[attr] = value;
		}
		
		//CONTROLLER
		this.listeners = null;//Array of EventListeners.
		
		if(__config.logging){
			log('');
			log('new '+this.toString()+'()');
			logMethod(this, 'init', arguments);
			//logMethod(this, this.init, arguments);//Todo: This is supposed to include the parameters, but it doens't work yet.
		}
		
		this.inited = true;
	}
	
	this.destroy = function(onComplete){
		this.inited = false;
		
		for(var i in this.listeners){
			var listener = this.listeners[i];//EventListener
			this.removeEventListener(listener.name, listener.listenerFunction);
		}
		this.listeners = null;
		
		for(var i in window._controllers){
			var controller = window._controllers[i];
			if(controller == this){
				window._controllers = array.splice(i, 1);
			}
		}
	}
	
	
	//INSTANCE METHODS
	this.addEventListener = function(eventType, originalScope, listenerFunction){//(String, obj, function):void
		if(!eventType || !originalScope || !listenerFunction){
			e.e;//Throw a runtime error. You must provide an original scope.
		}
		if(!this.listeners) this.listeners = [];
		if(this.hasEventListener(eventType, originalScope, listenerFunction)) return;//don't add a duplicate listener
		var listener = new pulley.EventListener(eventType, originalScope, listenerFunction);
		this.listeners.push(listener);
	}
	
	this.hasEventListener = function(eventType, originalScope, listenerFunction){//(String, obj, function):Boolean
		if(!this.listeners) return false;
		for(var i=0; i<this.listeners.length; i++){
			var listener = this.listeners[i];
			if((eventType == listener.eventType) && (listenerFunction == listener.listenerFunction)){
				return true;
			}
		}
		return false;
	}
	
	this.removeEventListener = function(eventType, listenerFunction){//(String, function):void
		if(!this.listeners) return;
		for(var i=0; i<this.listeners.length; i++){
			var listener = this.listeners[i];
			if((eventType == listener.eventType) && (listenerFunction == listener.listenerFunction)){
				this.listeners.splice(i, 1);
				return;
			}
		}
	}
	
	/*this.toString = function(){
		//return typeOfObject(this);
		var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((this).constructor.toString());
		if(this.eventType) return this.eventType;
		return (results && results.length > 1) ? results[1] : "";
	};*/
	
	this.dispatchEvent = function(eventType, data){//(String, obj):void
		if(!this.listeners) return;
		var i=0;
		for(var i=0; i<this.listeners.length; i++){
			var listener = this.listeners[i];//EventListener
			if(eventType == listener.eventType){
				//listener.listenerFunction(eventType, listener.originalScope, data);
				listener.listenerFunction.call(listener.originalScope, eventType, data);//Use the "call" function to pass the right scope through as the first parameter. On the receiving end, the first parameter is omited.
			}
		}
	}
	
}


//EXTEND
pulley.Controller = Class.extend(new pulley.Controller());//Extends John Resig's "Class".
pulley.Controller.type = 
pulley.Controller.prototype.type = 'Controller';


//STATIC VARS
//pulley.Controller.staticVar = null;


//STATIC METHODS
//pulley.Controller.staticMethod = function(){};


/*****
End class: Controller
*****/








/*****
Class: EventListener
Extends: Class
Notes: For internal use by Controller.
*****/

pulley.EventListener = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(eventType, originalScope, listenerFunction){//(String, Function, Object):EventListener
		
		if(!eventType || !listenerFunction || !originalScope) e.e;//Throw a runtime error. You must provide an original scope.
		
		this.eventType = eventType;
		this.listenerFunction = listenerFunction;
		this.originalScope = originalScope;
		
		return this;
	}
}


//EXTEND
pulley.EventListener = Class.extend(new pulley.EventListener());//Extends John Resig's "Class".
pulley.EventListener.type = 
pulley.EventListener.prototype.type = 'EventListener';


//STATIC VARS
//pulley.EventListener.staticVar = null;


//STATIC METHODS
//pulley.EventListener.staticMethod = function(){};


/*****
End class: EventListener
*****/

/* **********************************************
     Begin model-controller.js
********************************************** */

/*****
Class: ModelController
Extends: Controller
Notes: 
*****/

pulley.model.ModelController = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(initObj, onComplete){
		
		//PROPERTIES
		//Don't define any here.
		//this.id = null;
		//this.objType = nul;//Use objType instead of type, to prevent overriding the existing property.
		
		//CONTROLLER
		//All objects should use a singular interface to connect with the API. Define these methods in the subclass init().
		this.APIInterface = null;//The class instalce that contains the API methods (AppModel).
		this.APIInterface_loadObjectMethod = null;
		this.APIInterface_saveObjectMethod = null;
		this.APIInterface_deleteObjectMethod = null;
		
		this._super(initObj);//Call after setting properties. Don't pass through onComplete
		
		if(onComplete) onComplete();
	}
	
	
	//INSTANCE METHODS
	this.setModel = function(model){
		//Copy values from the initObj to this.
		for(var attr in model){
			if(attr != 'isStub'){//Don't copy this attribute.
				var localAttr = attr;
				this[localAttr] = model[attr]
			}
		}
		this.dispatchEvent(pulley.model.ModelController.CHANGED, this);
	}
	
	this.load = function(onSuccess, onError){
		var _this = this;
		this.APIInterface_loadObjectMethod.call(this.APIInterface, this, onSuccess2, onError2);//Use the "call" function to pass the right scope through as the first parameter. On the receiving end, the first parameter is omited.
		
		function onSuccess2(data){
			_this.dispatchEvent(pulley.model.ModelController.LOADED, _this);
			if(onSuccess) onSuccess();
		}
		function onError2(message){
			onError(message);
		}
	}
	
	this.save = function(onSuccess, onError){
		var _this = this;
		this.APIInterface_saveObjectMethod.call(this.APIInterface, this, onSuccess2, onError2);//Use the "call" function to pass the right scope through as the first parameter. On the receiving end, the first parameter is omited.
		
		function onSuccess2(data){
			_this.dispatchEvent(pulley.model.ModelController.SAVED, _this);
			if(onSuccess) onSuccess();
		}
		function onError2(message){
			onError(message);
		}
	}
	
	this.delete = function(onSuccess, onError){//Function name is written differently, since delete is a keyword.
		var _this = this;
		this.APIInterface_deleteObjectMethod.call(this.APIInterface, this, onSuccess2, onError2);//Use the "call" function to pass the right scope through as the first parameter. On the receiving end, the first parameter is omited.
		
		function onSuccess2(data){
			_this.dispatchEvent(pulley.model.ModelController.DELETED, _this);
			if(onSuccess) onSuccess();
		}
		function onError2(message){
			onError(message);
		}
	}
	
	this.destroy = function(){//Allow this object to be deleted, without calling the API. This method is typically called when a parent object was deleted.
		this.id = null;
		this.name = null;
		//Define this method in subclasses to override attributes.
		this.dispatchEvent(pulley.model.ModelController.DELETED, this);
	}
	
}


//EXTEND
pulley.model.ModelController = pulley.Controller.extend(new pulley.model.ModelController());
pulley.model.ModelController.type = 
pulley.model.ModelController.prototype.type = 'pulley.model.ModelController';


//STATIC VARS
pulley.model.ModelController.CHANGED = 'changed';
pulley.model.ModelController.LOADED = 'loaded';
pulley.model.ModelController.SAVED = 'saved';
pulley.model.ModelController.DELETED = 'deleted';


//STATIC METHODS
//pulley.model.ModelController.staticMethod = function(){};


/*****
End Class: ModelController
*****/

/* **********************************************
     Begin utility.js
********************************************** */

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

function cleanArray(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {         
			this.splice(i, 1);
			i--;
		}
	}
	return this;
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


/* **********************************************
     Begin nav-bar.js
********************************************** */

/*****
Class: NavBarModel
Extends: ModelController, Controller
Notes: 
*****/

pulley.view.controls.NavBarModel = function(){
	
	var NavBarModel = pulley.view.controls.NavBarModel;
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(initObj, onComplete){
		
		//PROPERTIES
		//this.id //String super
		//this.type //String super
		this.left = null;//String, or Array of Elements or ViewControllers
		this.middle = null;//String
		this.right = null;//String, or Array of Elements or ViewControllers
		
		this._super(initObj);//Call after setting properties. Don't pass through onComplete
		
		if(onComplete) onComplete();
	}
	
	
	//OVERRIDE ModelController
	/*this.setModel = function(model){//(NavBarModel):void
		this._super(model);
	}*/
	this.setModel_left = function(model){//(String of HTML, Element, or Array of Elements):void
		this.left = model;
		this.dispatchEvent(pulley.view.controls.NavBarModel.CHANGED);
	}
	this.setModel_right = function(model){//(String of HTML, Element, or Array of Elements):void
		this.right = model;
		this.dispatchEvent(pulley.view.controls.NavBarModel.CHANGED);
	}
	this.setModel_middle = function(model){//(String of HTML, Element, or Array of Elements):void
		this.middle = model;
		this.dispatchEvent(pulley.view.controls.NavBarModel.CHANGED);
	}
	/*this.load = function(onSuccess, onError){
		this._super(onSuccess, onError);
	}*/
	/*this.save = function(onSuccess, onError){
		this._super(onSuccess, onError);
	}*/
	/*this.delete = function(onSuccess, onError){
		this._super(onSuccess, onError);
	}*/
	
	
	//INSTANCE METHODS
	//
}


//EXTEND
pulley.view.controls.NavBarModel = pulley.model.ModelController.extend(new pulley.view.controls.NavBarModel());
pulley.view.controls.NavBarModel.type = 
pulley.view.controls.NavBarModel.prototype.type = 'pulley.view.controls.NavBarModel';


//STATIC VARS
pulley.view.controls.NavBarModel.CHANGED = 'changed';


//STATIC METHODS
//pulley.view.controls.NavBarModel.staticMethod = function(){};


/*****
End Class: NavBarModel
*****/










/*****
Class: NavBarVC
Extends: ViewController, Controller
Notes: 
*****/

pulley.view.controls.NavBarVC = function(){
	
	this.init = function(){//(arguments):void (Arguments are different, whether using Angular or Pulley)
		
		if(this.initializedByAngular){
			this._super.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		}else{//Using pulley patterns
			var view = arguments[0];
			var model = arguments[1];
			var onComplete = arguments[2];
			this._super(view, model);//Don't pass through onComplete.
		}
		
		//SETTINGS
		//this.settings.settingA = null;
		
		//MODEL
		//this.model.valueA = null;
		
		//VIEW
		this.children.left = this.$view.find('>.inner >.left')[0];
		this.children.middle = this.$view.find('>.inner >.middle')[0];
		this.children.right = this.$view.find('>.inner >.right')[0];
			
		//CONTROLLER
		/*this.states = [
			new State({
				id:'stateId',
				name:'Default',
				hash:'',
				type:State.TYPE__PAGE,
				implementation:setState_stateId,
				view:this.children.state1
			})
		];*/
		
		if(onComplete) onComplete();
	}
	
	
	//EXTEND ViewController
	this.destroy = function(){
		this._super();//Don't pass through onComplete.
		
		//destroy CHILDREN
		//
		
		//destroy INTERACTION
		//
	}
	this.ready = function(onComplete){//(function):void
		//DEFINE AND INIT CHILDREN (before calling super)
		//
		
		this._super();//Call after children are defined.
		
		//READY CHILDREN
		//
		
		//INIT INTERACTION
		//
		
		//SET INITIAL STATE
		//this.setState(0, model, false);//(state:State or Number, useTransition:Boolean):void
		
		if(onComplete) onComplete();
	}
	/*this.reset = function(resetModel){//(Boolean):void
		this._super(resetModel);
	}*/
	this.setModel = function(model){//(NavBarModel):void
		//this._super(model);//Override
		var hasModelChanged = (model != this.model);
		if(hasModelChanged){
			this.model = model;
			//SET MODEL TO SELF
			this.model.addEventListener(pulley.view.controls.NavBarModel.CHANGED, this, this.model_onChanged);//(eventName, originalScope, listenerFunction)
		
			//SET MODEL TO CHILDREN
			//
		}
		
		//UPDATE THE VIEW
		this.apply();
		
		if(hasModelChanged){
			//goto();
		}
	}
	this.apply = function(){//(void):void
		this._super();
		
		//RESET UI AS NEEDED
		this.children.left.innerHTML = '';
		this.children.middle.innerHTML = '';
		this.children.right.innerHTML = '';
		
		//APPLY MODEL
		if(this.model){
			
			//CREATE CONTROLS
			//Create left and right buttons
			var parts = {
				left:this.children.left,
				middle:this.children.middle,
				right:this.children.right
			};
			for(var name in parts){
				var part = parts[name];
				var partModel = this.model[name];
				var $content = null;
				if(!partModel){
					$content = null;
				}else if(partModel instanceof Array){
					$content = $(partModel);
				}else if(partModel instanceof pulley.view.ViewController){
					$content = partModel.$view;
				}else if(partModel instanceof Element){
					$content = $(partModel);
				}else if(typeof partModel === 'string'){
					$content = $(partModel);
				}else{
					e.e;//Invalid partModel type.
				}
				$(part).append($content);
			}
		}
	}
	/*this.setSize = function(w, h){//(int, int):void{
		this._super(w, h);
	}*/
	
	
	//STATE IMPLEMENTATIONS
	/*this.setState_stateId = function(useTransition, stateModel, reverse, onComplete){//(Boolean, Boolean, Function):void
		var _this = this;
		var lockId = 'NavBarVC.setState_stateId '+Math.random();
		//__app.lock(lockId);
		
		//Hide all non-relevant siblings, to be sure they are gone.
		//$(this.children.child).css({opacity:0, display:'none'});
		
		if(!useTransition){
			//Show and hide relevant elements.
			done();
		}else{
			if(reverse){
				//Run transitions
				done();
			}else{
				//Run transitions
				done();
			}
		}
		function done(){
			//Set substates.
			//__app.unlock(lockId);
			if(onComplete) onComplete();
		}
	}*/
	
	this.model_onChanged = function(eventName, data){//(eventName, data)
		if(__config.logging) log('NavBarVC._applyModelToView()');
		this.apply();
	}
	
}


//EXTEND
pulley.view.controls.NavBarVC = pulley.view.ViewController.extend(new pulley.view.controls.NavBarVC());
pulley.view.controls.NavBarVC.type = 
pulley.view.controls.NavBarVC.prototype.type = 'pulley.view.controls.NavBarVC';


//STATIC VARS
//pulley.view.controls.NavBarVC.staticVar = 'staticVar';


//STATIC METHODS
pulley.view.controls.NavBarVC.getClassNameByLabel = function(label){//(String):String
	var className = label.toCamelCase()+'Button';
	return className;
}


/*****
End Class: NavBarVC
*****/




/* **********************************************
     Begin paginator.js
********************************************** */

/*****
Class: PaginatorVC
Extends: ViewController, Controller
Notes:
*****/

pulley.view.controls.PaginatorVC = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(){//(arguments):void (Arguments are different, whether using Angular or Pulley)
		
		if(this.initializedByAngular){
			this._super.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		}else{//Using pulley patterns
			var view = arguments[0];
			var model = arguments[1];
			var onComplete = arguments[2];
			this._super(view, model);//Don't pass through onComplete.
		}
		
		//SETTINGS
		//
		
		//ASSETS
		//
		
		//MODEL
		this.model = null;//Array of Objects with format [{label: String, onClick:Function}];
		
		//VIEW
		this.children.list				= this.$view.find('>ul')[0];
		this.children.items				= null;//Defined on setModel
		
		//CONTROLLER
		/*this.states = [
			new State({
				id:'state_prepareForTransitionIn',//String
				implementation: setState_0_prepareForTransitionIn//Function
			}),
			new State({
				id:'state_primary',
				implementation: setState_1_primary
			}),
			new State({
				id:'state_transitionedOut',
				implementation: setState_2_transitionedOut
			})
		];*/
		
		//INITIALIZE
		//
		
	}
	
	
	//OVERRIDE ViewController
	/*this.destroy = function(){//():void
		this._super();
	}*/
	this.ready = function(onComplete){//(function):void
		//DEFINE AND INIT CHILDREN (before calling super)
		//
		
		//READY CHILDREN
		this._super();
		
		//INIT INTERACTIVITY
		//
		
		//SET INITIAL STATE
		//this.setState(0);//Prepare for transition in.
		this.setSize();
		
		if(onComplete) onComplete();
	}
	/*this.reset = function(resetModel){//(Boolean):void
		this._super(resetModel);
	}*/
	this.setModel = function(model){//(_.Model):void
		var hasModelChanged = (model != this.model);
		this._super(model);
		
		if(hasModelChanged){
			
			//DESTOY OLD VIEW
			$(this.children.items).off('click', item_onClick);
			this.children.list.innerHTML = '';
			
			//APPLY MODEL TO SELF
			for(var i in this.model){
				var itemModel = this.model[i];
				var href = itemModel.href? itemModel.href : '';
				var label = itemModel.label? itemModel.label : '';
				var itemHTML = ""+
				"<li data-id='"+i+"'>"+
				"	<a href='"+href+"' alt='"+label+"'>"+
				"		<span class='bullet'></span>"+
				"		<div class='label'>"+label+"</div>"+
				"	</a>"+
				"</li>";
				$(this.children.list).append(itemHTML);
			}
			this.children.items = this.$view.find('li').toArray();
			$(this.children.items).on('click', {scope:this}, item_onClick);
			
			if(this.model){
				if(this.model.length < 2){
					$(this.children.list).css({display:'none', opacity:0});
				}else{
					$(this.children.list).css({display:'block', opacity:1});
				}
			}
			
			//APPLY MODEL TO CHILDREN
			//
		}
		
		//UPDATE THE VIEW
		this.apply();
		
		if(hasModelChanged){
			//goto();
		}
	}
	this.apply = function(){//(void):void
		this._super();
		
		//RESET UI
		//
		
		//APPLY MODEL
		if(this.model){
			
			//CREATE CONTROLS
			//
			
			//INIT INTERACTIVITY
			//
			
		}
	}
	this.setSize = function(w, h){//(int, int):void{
		var _this = this;
		this._super();
	}
	
	
	//STATE IMPLEMENTATIONS
	/*this.setState_stateId = function(useTransition, stateModel, reverse, onComplete){//(Boolean, Boolean, Function):void
		var _this = this;
		if(onComplete) onComplete();
	}*/
	
	
	//INSTANCE METHODS
	function item_onClick(event){//(event):void
		var _this = event.data.scope;
		var item = event.currentTarget;
		var itemIndex = eval($(item).attr('data-id'));
		var itemModel = _this.model[itemIndex];
		if(itemModel.onClick){
			event.preventDefault();//Don't change URL.
			var data = {
				item:itemModel,
				index:itemIndex
			}
			itemModel.onClick(data);
		}
		_this.selectItem(itemModel);
	}
	function selectItem(itemModel){//(Object):void
		var itemIndex = null;
		for(var i in this.model){
			var itemModel2 = this.model[i];
			if(itemModel2 == itemModel){
				itemIndex = eval(i);
				break;
			}
		}
		if(!(itemIndex > -1)){
			console.error('No such item found.');
		}
		this.selectedIndex = itemIndex;
		this.selectedItem = itemModel;
		for(var i in this.model){
			var itemModel = this.model[i];
			var item = this.children.items[i];
			if(itemModel == this.selectedItem){
				$(item).addClass('selected');
			}else{
				$(item).removeClass('selected');
			}
		}
		this._dispatchEvent('itemSelected', this.selectedItem);
	}
	function selectItemByIndex(i){//(Number):void
		var itemModel = this.model[i];
		this.selectItem(itemModel);
	}
	function selectItemById(id){//(Number):void
		var itemModel = null;
		for(var i in this.model){
			var itemModel2 = this.model[i];
			if(id == itemModel2.id){
				itemModel = itemModel2;
				break;
			}
		}
		if(!itemModel){
			console.error('No such item found.');
		}
		this.selectItem(itemModel);
	}
}


//EXTEND
pulley.view.controls.PaginatorVC = pulley.view.ViewController.extend(new pulley.view.controls.PaginatorVC());
pulley.view.controls.PaginatorVC.type
pulley.view.controls.PaginatorVC.prototype.type = 'pulley.view.controls.PaginatorVC';


//STATIC VARS
//pulley.view.controls.PaginatorVC.staticVar = null;


//STATIC METHODS
//pulley.view.controls.PaginatorVC.staticMethod = function(){};


/*****
End Class: PaginatorVC
*****/

/* **********************************************
     Begin guides.js
********************************************** */

/*****
Class: pulley.view.controls.GuidesVC
Extends: ViewController, Controller
Notes: 
*****/
pulley.view.controls.GuidesVC = function(){
	
	
	//IMPORT
	var FooVC = pulley.view.controls.GuidesVC;
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	
	this.init = function(){//(arguments):void (Arguments are different, whether using Angular or Pulley)
		
		if(this.initializedByAngular){
			this._super.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		}else{//Using pulley patterns
			var view = arguments[0];
			var model = arguments[1];
			var onComplete = arguments[2];
			this._super(view, model);//Don't pass through onComplete.
		}
		
		//SETTINGS
		//this.settings.settingA = null;
		
		//MODEL
		//this.model.valueA = null;
		this.model.numberOfGuidesToShow = getURLVar('guides');
		
		//VIEW
		//this.children.state1			= this.view.find('.clip')[0];//or .toArray()
		//this.children.navBar			= null;//ViewController defined on ready().
			
		//CONTROLLER
		/*this.states.push(new State({
			id:'state1_foo',
			name:'Foo',
			hash:'some-hash',
			type:State.TYPE__PAGE,
			implementation:setState_state1,
			view:this.children.state1
		}));
		this.states.push(new State({
			id:'state2_foo',
			name:'Foo',
			hash:null,
			type:State.TYPE__PAGE,
			implementation:setState_state2,
			view:null
		}));*/
		
		//INIT CHILDREN
		//
		
		if(onComplete) onComplete();
	}
	
	
	this.ready = function(onComplete){//(function):void
		//DEFINE CHILDREN (before calling super)
		//this.children.navBar			= window._controllers['NavBarVC0'];//Locate the auto-initialized controller.
		
		this._super();//Call after children are defined.
		
		//READY CHILDREN
		//
		
		//INIT INTERACTION
		//
		
		//SET INITIAL STATE
		//this.setState(0, null, false);//(state:State or Number, stateModel:ModelController, useTransition:Boolean):void
		//Show guides for debugging
		switch(this.numberOfGuidesToShow){
			case '1':
				$(this.view).find('.one-column').css({display:'block'}); break;
			case '2':
				$(this.view).find('.two-columns').css({display:'block'}); break;
			case '3':
				$(this.view).find('.three-columns').css({display:'block'}); break;
			case '4':
				$(this.view).find('.four-columns').css({display:'block'}); break;
			case '6':
				$(this.view).find('.six-columns').css({display:'block'}); break;
			case '12':
				$(this.view).find('.twelve-columns').css({display:'block'}); break;
		}
		
		if(onComplete) onComplete();
	}
	
	
	//EXTEND ViewController as desired
	/*this.destroy = function(){
		this._super();//Don't pass through onComplete.
		
		//destroy CHILDREN
		//
		
		//destroy INTERACTION
		//
	}*/
	
	
	/*this.reset = function(resetModel){//(Boolean):void
		this._super(resetModel);
	}*/
	/*this.focus = function(){//():void
		this._super();
	}*/
	
	
	/*this.setModel = function(model){//(FooModel):void
		//this._super(model);//Override
		var hasModelChanged = (model != this.model);
		if(hasModelChanged){
			this.model = model;
			//BIND TO MODEL
			if(this.model){
				var isBound = this.model.hasEventListener(ModelController.CHANGED, this.model_onChanged);
				if(!isBound){
					this.model.addEventListener(ModelController.LOADED, this, this.model_onLoaded);
					this.model.addEventListener(ModelController.CHANGED, this, this.model_onChanged);
					//this.model.addEventListener(ModelController.SAVED, this, this.model_onSaved);
					//this.model.addEventListener(ModelController.DELETED, this, this.model_onDeleted);
				}
			}
			
			//DELETE OLD ELEMENTS
			//
			
			//CREATE BLANK NEW ELEMENTS and add listeners. Do not apply model yet.
			//
			
			//SET MODEL TO CHILDREN
			//
		}
		
		//APPLY MODEL TO ELEMENTS
		this.apply();
		
		if(hasModelChanged){
			//goto();
		}
	}
	this.model_onLoaded = function(event, data){
		this.setModel(this.model);
	}
	this.model_onChanged = function(event, data){
		this.apply();
	}
	this.model_onSaved = function(event, data){
		this.setModel(this.model);
	}
	this.model_onDeleted = function(event, data){
		this.apply();
	}*/
	
	
	/*this.apply = function(){//(void):void
		this._super();
		
		//APPLY MODEL TO EXISTING ELEMENTS
	}*/
	/*this.setSize = function(w, h){//(int, int):void{
		this._super(w, h);
	}*/
	
	
	//STATE IMPLEMENTATIONS
	/*this.setState = function(state_or_stateIndex, stateModel, useTransition, onComplete){//(State or Number, Boolean, Function):void
		this._super(state_or_stateIndex, stateModel, useTransition, onComplete);
	}*/
	/*this.setState_stateId = function(useTransition, stateModel, reverse, onComplete){//(Boolean, Boolean, Function):void
		var _this = this;
		var lockId = 'FooVC.setState_stateId '+Math.random();
		//__app.lock(lockId);
		
		//Hide all non-relevant siblings, to be sure they are gone.
		//$(this.children.child).css({opacity:0}).hide();
		
		//Apply model
		//
		
		if(!useTransition){
			//Show and hide relevant elements.
			done();
		}else{
			if(reverse){
				//Run transitions
				done();
			}else{
				//Run transitions
				done();
			}
		}
		function done(){
			//Set substates.
			//__app.unlock(lockId);
			if(onComplete) onComplete();
		}
	}
	*/
	
}


//EXTEND
pulley.view.controls.GuidesVC = pulley.view.ViewController.extend(new pulley.view.controls.GuidesVC());
pulley.view.controls.GuidesVC.type =
pulley.view.controls.GuidesVC.prototype.type = 'pulley.view.controls.GuidesVC';


//STATIC VARS
//company.project.view.views.staticVar = null;


//STATIC METHODS
//pulley.view.controls.GuidesVC.staticMethod = function(){};


/*****
End Class: FooVC
*****/





/* **********************************************
     Begin local-data.js
********************************************** */

/*****
Class: LocalData
Extends: ModelController, Controller
Notes: 
*****/

pulley.model.LocalData = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(modelControllerClassesByType, onComplete){	
		
		this.modelControllerClassesByType = modelControllerClassesByType;//An object that maps the strings that the API calls objects to their ModelController classes.
		/*Example: {
			Flight:lively.partneradmin.model.valueobjects.FlightModel,
			FlightGroup:lively.partneradmin.model.valueobjects.FlightGroupModel
		};*/
		
		this.catalog = {
			Flights:null,//Array of FlightModels
			FlightGroups:null,//Array of FlightGroupModels
		}
		
		if(onComplete) onComplete();
	}
	
	//INSTANCE METHODS
	this.addObject = function(object){
		if(!object){
			e.e;//No object provided.
		}
		if(!object.id){
			e.e;//Do not add objects unless they have an id.
		}
		var catalogedObjectsOfType = this.getCatalogByObjType(object.objType);
		catalogedObjectsOfType[object.id] = object;
	}
	this.getCatalogByObjType = function(objType){
		var catalogTypeName = objType+'s'
		var catalogedObjectsOfType = this.catalog[catalogTypeName];
		if(!catalogedObjectsOfType){//If a catalog of this item type does not exist yet, create it.
			catalogedObjectsOfType = this.catalog[catalogTypeName] = [];
		}
		return catalogedObjectsOfType;
	}
	this.getObjectFromCatalogByObjTypeAndId = function(objType, id){
		var catalogedObjectsOfType = this.getCatalogByObjType(objType);
		if(catalogedObjectsOfType){//If a catalog of this item type does not exist yet, create it.
			var object = catalogedObjectsOfType[id];
			return object;
		}
		return null;
	}
	this.updateObjects = function(objects){//(Array (or single instance) of Objects/ModelControllers to be added, modified or removed.)
		var  _this = this;
		if(__config.logging) log('LocalData.updateObjects()');
		
		var errors = [];
		var resultingObjects = [];//A collection of the resulting ModelControllers, to return. Maps 1-to-1 to objects submitted.
		if(objects instanceof Array){
			for(var i in objects){
				var obj = objects[i];
				var result = updateObject(obj);
				resultingObjects[i] = result.data;
				if(!result.success){
					errors.push(result);
				}
			}
		}else{
			var result = updateObject(objects);
			
			if(!result.success){
				errors.push(result);
			}
		}
		if(errors.length){
			return {success:false, message:'One or more objects failed to update.', data:errors};
		}else{
			return {success:true, message:'Successfully updated all objects.', data:resultingObjects};
		}
		
		function updateObject(newObjectJSON){//(JSONObj or ModelController):Object. Adds object, or updates an existing object.
			var catalogedObjectsOfType = _this.getCatalogByObjType(newObjectJSON.objType);
			var existingObject = catalogedObjectsOfType[newObjectJSON.id];
			if(existingObject){
				//If the object exists, update it.
				existingObject.setModel(newObjectJSON);
				return {success:true, message:'Updated existing object.', data:existingObject};
			}else{
				//If it doesn't exist, add it.
				var modelControllerClass = _this.modelControllerClassesByType[newObjectJSON.objType];
				var newObject = new modelControllerClass(newObjectJSON);//ModelController. Create a new ModelController instance, using the JSON object as an initializer.
				catalogedObjectsOfType[newObjectJSON.id] = newObject;
				return {success:true, message:'Added object.', data:newObject};
			}
			
			/*for(var i in catalogedObjects){
				var obj4 = catalogedObjects[i];
				if(obj4){
					if(obj4.objType == obj3.objType && obj4.id == obj3.id){
						//We found the object to update.
						obj4.setModel(obj3);//Reset its model. This is preferable to replacing the whole object.
						return {success:true, message:'Updated existing object.'};
						
					}else if(obj4 instanceof Array){
						//We found an array of objects. Check if the type of objects in the array is the type we are looking for.
						var prototypeObj = null;
						for(var j in obj4){
							prototypeObj = obj4[j];
							if(prototypeObj){
								break;
							}
						}
						if(prototypeObj){
							if(prototypeObj.objType == obj3.objType){
								//We found the right array.
								var objectToUpdate = obj4[obj3.id];
								if(objectToUpdate){
									objectToUpdate.setModel(obj3);//Reset its model. This is preferable to replacing the whole object.
									return {success:true, message:'Updated existing object.'};
								}else{
									//If an existing object was not found, add a new one.
									var objType = (obj3.objType.indexOf('Model') > -1)? obj3.objType : obj3.objType+'Model';
									var objClass = window[objType];
									var obj3Model = new objClass(obj3);
									obj4[obj3Model.id] = obj3Model;//Add the object to the array.
									return {success:true, message:'Added object.'};
								}
							}
						}
					}else{
						//Ignore it.
					}
				}
			}
			return {success:false, message:'Did not find object to update.'};*/
		}
	}
	
	this.removeObjects = function(objects){//(Array of Objects or ModelControllers to be removed from the catalog.):Object
		var  _this = this;
		if(__config.logging) log('LocalData.updateObjects()');
		
		var errors = [];
		if(objects instanceof Array){
			for(var i in objects){
				var obj = objects[i];
				var result = removeObject(obj);
				if(!result.success){
					errors.push(result);
				}
			}
		}else{
			var result = removeObject(objects);
			if(!result.success){
				errors.push(result);
			}
		}
		if(errors.length){
			return {success:false, message:'One or more objects failed to be removed.', data:errors};
		}else{
			return {success:true, message:'Successfully removed all objects.'};
		}
		
		function removeObject(objectToRemove){//(JSONObj or ModelController):Object
			var catalogedObjectsOfType = _this.catalog[objectToRemove.objType+'s'];
			if(!catalogedObjectsOfType){
				return {success:false, message:'There are no cataloged items of this type.', data:objectToRemove};
			}
			var existingObject = catalogedObjectsOfType[objectToRemove.id];
			if(existingObject){
				//If the object exists, remove it from the catalog.
				catalogedObjectsOfType.splice(objectToRemove.id, 1);//Remove from array.
				//Erase the object and notify any connected views that this object has been deleted.
				existingObject.destroy();
				return {success:true, message:'Updated existing object.', data:existingObject};
			}else{
				return {success:true, message:'The object did not exist to remove.'};
			}
		}
	}
}


//EXTEND
pulley.model.LocalData = Class.extend(new pulley.model.LocalData());
pulley.model.LocalData.type = 
pulley.model.LocalData.prototype.type = 'pulley.model.LocalData';


//STATIC VARS
//pulley.model.LocalData.staticVar = null;


//STATIC METHODS
//pulley.model.LocalData.staticMethod = function(){};



/*****
End Class: LocalData
*****/

/* **********************************************
     Begin html-injector.js
********************************************** */

/*****
Class: HTMLInjector
Extends: none
Implements: none
Notes: This class allows you to:

A) Use HTML includes with JavaScript.
Example: <div id='appContainer' data-include-src='src/view/App/App.html' data-include-id='app'></div>

B) Initialize ViewControllers automatically by declaring them in HTML.
Example: <div class='App'> (Automatically instantiates with a class named 'AppVC' if it exists.

C) Inject HTML through the creation of a new ViewController.
Example: HTMLInjector.createControllerAndInjectHTML(containerElement, StorySlideVC, 'storySlide3');

These techniques are useful, because they allow you to organize your code cleanly and logically.
They make the developers job easier, by giving a little bit more work to JavaScript.
*****/

pulley.HTMLInjector = function(){
	//No real constructor, since this is a static class.
}


//EXTEND Controller
pulley.HTMLInjector = pulley.Controller.extend(new pulley.HTMLInjector());
pulley.HTMLInjector.prototype.type = 
pulley.HTMLInjector.type = 'pulley.HTMLInjector';


//STATIC VARS
pulley.HTMLInjector.templates = null;//Array of HTML template strings.


//STATIC METHODS
pulley.HTMLInjector.toString = function(){
	return 'HTMLInjector';//Neccessary to implement for the static methods to reference for logging.
}

//This method recursively loads all HTML files within an element. Then it initializes any controllers within that element.
pulley.HTMLInjector.initializePage = function(containerElement, HTMLTemplateURLsToPreload, onComplete){//(element):void
	logMethod(this, 'initializePage', arguments);
	
	pulley.HTMLInjector._loadHTMLTemplates(HTMLTemplateURLsToPreload, onHTMLTemplatesLoaded);
	
	function onHTMLTemplatesLoaded(){
		pulley.HTMLInjector._injectIncludes(containerElement, onIncludesInjected);
	}
	
	function onIncludesInjected(){
		pulley.HTMLInjector._initializeControllers(containerElement, onComplete);
	}
}

//This method loads HTML files so that they can be used by a ViewController later.
//On initialization, if the VC is not provided with a view, it find its template via HTMLInjector.getHTMLTemplateByName(className).
pulley.HTMLInjector._loadHTMLTemplates = function(arrayOfTemplateURLs, onComplete){
	if(!pulley.HTMLInjector.templates){
		pulley.HTMLInjector.templates = [];
	}
	if(arrayOfTemplateURLs.length < 1){
		onComplete();
		return;
	}
	for(var i in arrayOfTemplateURLs){
		var templateURL = arrayOfTemplateURLs[i];
		
		//Try to find the template, which should have been injected by PHP.
		var templateClassName = templateURL.substring(templateURL.lastIndexOf('/')+1, templateURL.lastIndexOf('.'));
		var template = $('.'+templateClassName)[0];
		if(template){
			onTemplateLoaded(template.outerHTML);
			
		}else{//If it wasn't injected via PHP and found, then load in via AJAX.
			$.ajax({
				url: templateURL,
				data: {},
				dataType:'html',
				success:function(data,text,xhqr){
					onTemplateLoaded(data);
				},
				error:function(p1,p2,p3)
				{
					log('Network Error:');
					log(p1.status.toString());
					log(p2.toString());
					log(p3.toString());
				},
				notmodified:function(data){},
				timeout:function(data){},
				abort:function(data){},
				parseerror:function(data){},
				complete:function(data){}
			});
		}
	}
	
	function onTemplateLoaded(templateHTML){
		pulley.HTMLInjector.templates.push(templateHTML);
		if(pulley.HTMLInjector.templates.length == arrayOfTemplateURLs.length){//All templates have loaded.
			onComplete();
		}
	}
}

pulley.HTMLInjector.getHTMLTemplateByViewControllerClass = function(viewControllerClass){
	logMethod(this, 'getHTMLTemplateByViewControllerClass', arguments);
	for(var i in pulley.HTMLInjector.templates){
		var template = pulley.HTMLInjector.templates[i];
		var j = template.indexOf('class=')+6;//Start of controller name.
		var quoteCharacter = template.charAt(j);
		var k = template.indexOf(quoteCharacter, j+1);//End of controller name.
		var controllerName = template.substring(j+1, k);
		if(controllerName == viewControllerClass.toString()){
			return template;
		}
	}
}

//This method goes through the HTML of a DOMElement and loads any includes.
//Includes are defined in HTML like this: <div data-include-src="clip.html" data-include-id="clip1"></div>
//Subsequently, it initializes any controllers that are defined within those includes, and recursively repeats this pattern down through the full DOM tree.
pulley.HTMLInjector._injectIncludes = function(container, onComplete){
	var _this = this;
	logMethod(this, '_injectIncludes', arguments);
	var clipsWithHTMLIncludes = $(container).find('*[data-include-src]').toArray();
	var clipsLoaded = 0;
	if(clipsWithHTMLIncludes.length){
		for(var i in clipsWithHTMLIncludes){
			var clip = clipsWithHTMLIncludes[i];
			loadInclude(clip);
		}
	}else{
		onRecursionComplete();
	}
	function onRecursionComplete(){
		clipsLoaded++;
		if(clipsLoaded >= clipsWithHTMLIncludes.length){//If all includes have loaded...
			if(onComplete) onComplete();
		}
	}
	function loadInclude(clip){
		logMethod(_this, 'loadInclude', arguments);
		var htmlURL = $(clip).attr('data-include-src');
		var newElementId = $(clip).attr('data-include-id');
		var newElementClasses = $(clip).attr('data-include-class');
		$.ajax({
			url: htmlURL,
			data: {},
			dataType:'html',
			success:function(data,text,xhqr){
				var html = data;
				var prototypeElement = $(html)[0];//Create a prototype element, so we can grab its innerHTML to use.
				clip.innerHTML = prototypeElement.innerHTML;//Inject content into the clip from the prototype.
				for(var i=0; i < prototypeElement.attributes.length; i++){//Copy attributes from the element to the prototype, so these are not lost.
					var prototypeAttributeName = prototypeElement.attributes[i].name;
					var prototypeAttributeValue = $(prototypeElement).attr(prototypeAttributeName);
					var clipAlreadyHasAttribute = $(clip).attr(prototypeAttributeName);
					if(!clipAlreadyHasAttribute){//If the clip doesn't already have this attribute, add it.
						$(clip).attr(prototypeAttributeName, prototypeAttributeValue);
					}
				}
				var child = clip.children[0];//The element we are loading and initializing. Assign data-include-id and data-include-class to it.
				if(newElementId){
					child.id = newElementId;
				}
				$(child).addClass(newElementClasses);
				$(clip).attr('data-include-loaded="true"');
				pulley.HTMLInjector._injectIncludes(clip, onRecursionComplete);
			},
			error:function(p1,p2,p3)
			{
				log('Network Error:');
				log(p1.status.toString());
				log(p2.toString());
				log(p3.toString());
			},
			notmodified:function(data){},
			timeout:function(data){},
			abort:function(data){},
			parseerror:function(data){},
			complete:function(data){}
		});
	}
}

//This goes through the HTML of a DOMElement and initializes any controllers.
//Controllers are defined in HTML like this: <div class="Clip">stuff</div>. This looks for a controller with name ClipVC.
pulley.HTMLInjector._initializeControllers = function(container, onComplete){
	var _this = this;
	logMethod(this, '_initializeControllers', arguments);
	var clipsWithControllersToInstantiate = $(container).find('*[class]').toArray();
	var clipsInitialized = 0;
	for(var i in clipsWithControllersToInstantiate){
		var clip = clipsWithControllersToInstantiate[i];
		var clipIsAlreadyInitialized = $(clip).attr('data-controller-initialized');
		if(!clipIsAlreadyInitialized){
			var automaticallyFindControllerByClassName = false;//I disabled this, since it makes makes namespacing controllers difficult.
			if(automaticallyFindControllerByClassName){
				var clip_classList = clip.className.split(/\s+/);
				for(var i in clip_classList){
					if(isNumber(i)){
						var className = clip_classList[i];
						var controllerName = className+'VC';
						var controllerClass = window[controllerName];
						if(controllerClass){
							var controller = new controllerClass(clip);//Pass in the view, so it has a reference.
							break;
						}
					}
				}
			}else{//Use the data-controller attribute.
				var controllerName = $(clip).attr('data-controller');
				if(controllerName){
					var controllerClass = getControllerByNamespaceString(controllerName);
					if(controllerClass){
						var controller = new controllerClass(clip);//Pass in the view, so it has a reference.
					}
				}
			}
		}
	}
	onComplete();
	
	function getControllerByNamespaceString(namespaceString){//String, example: pulley.view.controls.NavBarVC
		var namespacesArray = namespaceString.split(".");;//Array example, ['pulley','view','controls','NavBarVC'];
		var parentNamespace = window;
		for(var i in namespacesArray){
			var childNamespace = namespacesArray[i];
			parentNamespace = parentNamespace[childNamespace];
			if(!parentNamespace){
				e.e;//Invalid namespace.
			}
		}
		var controller = parentNamespace;
		return controller;
	}
}

pulley.HTMLInjector.createControllerAndInjectHTML = function(container, viewControllerClass, id){//(parentDOMElement, viewControllerClass, id):ViewController
	if(!id){
		id = viewControllerClass.createUniqueId();
	}
	var viewHTML = createHTML(viewControllerClass, id);
	$(container).append(viewHTML);
	var clip = document.getElementById(id);
	var clipVC = new viewControllerClass(clip);
	return clipVC;
	
	function createHTML(viewControllerClass, id){
		var htmlTemplate = pulley.HTMLInjector.getHTMLTemplateByViewControllerClass(viewControllerClass);
		var html = '';
		var pre = htmlTemplate.substring(0, htmlTemplate.indexOf(' '));//All text before the first space.
		var post = htmlTemplate.substr(htmlTemplate.indexOf(' '));//All text after the first space.
		html = pre + " id='"+id+"'" + post;
		return html;
	}
}


/*****
End Class: HTMLInjector
*****/

/* **********************************************
     Begin pulley.js
********************************************** */

//This file and all other JS files are concatonated and compressed by CodeKit into ../pulley.min.js