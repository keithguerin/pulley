//DEFINE PULLEY APPLICATION NAMESPACE
/*if(!window.pulley){
	window.pulley = {
		model:{
			valueobjects:{}
		},
		view:{
			controls:{}
		}
	}
}*/

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
registerNamespace('pulley');


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