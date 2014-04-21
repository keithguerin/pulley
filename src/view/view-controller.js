/*****
Class: ViewController
Extends: Controller
Notes: All view classes should extend this class. It adds additional methods that are needed throughout the app.
*****/

registerNamespace('pulley.view');

pulley.view.ViewController = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(){//view, model, onComplete){//(Boolean):void
		var _this = this;
		this._super();
		
		if(this.initializedByAngular){
			this.scope = arguments[0];
			this.scope.controller = this;
			//this.scope.getController = this.getController; //$.proxy( this.getController, this );
			view = arguments[1][0];
			model = null;
			onComplete = null;
		}else{
			view = arguments[0];
			model = arguments[1];
			onComplete = arguments[2];
		}
		
		//SETTINGS
		this.settings = {};//Object
		
		//VIEW
		//this.view = view;//DOMElement //If this is defined when using Angular, it causes an infinite loop and Angular fails to work.
		this.$view = $(view);//jQuery obj
		this.children = {};//Object
		
		//MODEL
		this.model = model;//Object
		
		//CONTROLLER
		if(!this.$view[0].id){
			this.$view[0].id = pulley.view.ViewController.createUniqueId(this);
		}
		this.id = this.$view[0].id;
		this.inited = false;
		this.readied = false;//Boolean
		this.setWidth = null;//Number
		this.setHeight = null;//Number
		this._locks = [];//Array of GUID Numbers.
		//State management
		this.previousState = null;//State
		this.currentState = null;//State
		this.states = [];//Array of States
		
		//Keep all active controllers in the window object, so we can find them if needed. They are automatically removed on destroy.
		//Use the method c('myFoo') to find controllers by id.
		if(!window._controllers){
			window._controllers = [];
			window.getControllerById = window.c = function(id){
				for(var i in window._controllers){
					var controller = window._controllers[i];
					if(controller.id == id){
						return controller;
					}
				}
			}
		}
		window._controllers[this.id] = this;
		
		//Mark the view as initialized.
		$(this.view).attr('data-controller-initialized','true');
		
		//INIT CONTROLS
		//
		
		//INIT INTERACTION
		//
		
		this.inited = true;
		if(onComplete) onComplete();
	}
	
	
	//PUBLIC INSTANCE METHODS
	this.destroy = function(){//(Boolean):void
		this._super(onComplete);
		
		//destroy MODEL
		this.model = null;
		this.setModel(null);//I'm not sure if we should run this or not.
		
		//destroy CONTROLLER
		this.inited = false;
		this.readied = false;
		this.setWidth = null;
		this.setHeight = null;
		this.previousState = null;
		this.currentState = null;
		this.states = null;
			
		//REMOVE INTERACTION
		//
		
		//destroy VIEW AND CHILDREN
		this.view = null;
		this.$view = null;
		for(var i in this.children){
			var child = children[i];
			if(child.parent) child.parent.removeChild(child);
			children[i] = null;
		}
		this.children = null;
	}
	this.ready = function(onComplete){//(Function):void
		var _this = this;
		logMethod(this, 'ready', arguments);
		
		//DEFINE AND INIT CHILDREN (before calling super)
		defineDeclarativeStates();
		
		//READY CHILDREN
		for(var i in this.children){
			var child = this.children[i];
			if(child){
				if(child.ready){
					if(child.readied) e.e;//This should not occur.
					child.ready();
				}
			}
		}
		
		//INIT INTERACTION
		//
		
		//SET INITIAL STATE
		//this.setState(0, stateModel, false);//(state:State or Number , useTransition:Boolean)
		
		//PLAY ANIMATION
		//
		
		this.readied = true;
		if(onComplete) onComplete();
		
		function defineDeclarativeStates(){
			//You can automatically create states by defining them in HTML.
			//This works well if you simply want to switch between views, without using transitions or change anything else.
			//Declare a state like this:
			//	Example: <div data-state-id='stateId' data-state-hash='home' data-state-implementation-method='setState_stateId'></div>
			var stateCandidates = _this.$view.find('[data-state-id]').toArray();
			if(stateCandidates.length){//Quickly check if there are any HTML-defined states, before searching the whole tree in detail.
				var declarativeStates = findStatesInChild(_this.view);
				_this.states = _this.states.concat(declarativeStates);//Add these states, in addition to those defined in script.
			}
			
			function findStatesInChild(element){
				var states2 = [];
				for(var i=0; i<element.children.length; i++){
					var childElement = element.children[i];
					if(childElement.hasAttribute('data-state-id')){//If this element is a state, add it to the array.
						var stateId = $(childElement).attr('data-state-id');//String
						var stateName = $(childElement).attr('data-state-name');//String
						var stateHash = $(childElement).attr('data-state-hash');//String
						var stateType = $(childElement).attr('data-state-type');//String (Enum)
						var stateImplementationMethodName = $(childElement).attr('data-state-implementation-method');//String
						if(stateImplementationMethodName){
							var stateImplementationMethod = _this[stateImplementationMethodName];//Function
							if(!stateImplementationMethod){
								console.error('No function with this name found.');
							}
						}
						var state = new State({
							id:stateId,
							name:stateName,
							hash:stateHash,
							type:stateType,
							implementation:stateImplementationMethod,
							view:childElement
						});
						//Replace the view with its ViewController if it has one.
						var childElementVC = c(childElement.id);
						if(childElementVC){
							state.view = childElementVC;
						}
						states2.push(state);
						
					}else if(!childElement.hasAttribute('data-controller-initialized')){//Don't look for states inside of other ViewControllers.
						var childStates = findStatesInChild(childElement);
						states2 = states2.concat(childStates);//Add child states to the list of states.
					}
				}
				return states2;
			}
		}
	}
	this.reset = function(resetModel){//(Boolean):void
		logMethod(this, 'reset', arguments);
		if(resetModel){
			this.destroy();
			this.init();
		}else{
			//this.setState(null, stateModel, false);
		}
	}
	this.focus = function(){//():void
		logMethod(this, 'focus', arguments);
	}
	this.setModel = function(model){//(_.Model):void
		logMethod(this, 'setModel', arguments);
		
		this.model = model;
		var hasModelChanged = (model != this.model);
		if(hasModelChanged){
			//APPLY MODEL TO SELF
			this.reset(false);//Reset the view
			this.model = model;
		
			//APPLY MODEL TO CHILDREN
			//
		}
		
		//UPDATE THE VIEW
		this.apply();
		
		if(hasModelChanged){
			//goto();
		}
	}
	this.apply = function(){//(void):void //Applies the model to view.
		logMethod(this, 'apply', arguments);
		
		if(this.initializedByAngular){
			this.scope.$apply();
		}
		
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
		logMethod(this, 'setSize', arguments);
		if(w >= 0){
			this.$view.width(w);
		}
		if(h >= 0){
			this.$view.width(h);
		}
		for(var i in this.children){
			var child = this.children[i];
			if(child){
				if(child.setSize){
					child.setSize();
				}
			}
		}
	}
	
	
	//STATE MANAGEMENT
	this.setState = function(state_or_stateIndex, stateModel, useTransition, onComplete){//(State or Number, Boolean, Function):void
		
		/*
			Use this method to manage the state of the ViewController. This is better than having custom goToSection/Part/Page methods.
			Instructions:
			1. Add the class 'ViewController__state' to each element that you want to represent a state.
				Everything in this state will be automatically turned on and off.
				It also needs a unique class that matches the stateId.
				Example: <div class='ViewController__state Foo__state1'></div>
				
			2. Define each state as an enumerable string constant, using the stateId.
				Example: Foo.STATE__STATE1 = 'state1';
				
			3. Define a dictionary of methods for each state, in the init() method.
				Example: this._stateMethods = {
					Foo.STATE__STATE1: setState_stateId
				}
				
			4. Implement these methods to set the view for this state.
				This method should show/hide children or siblings of the state (not the state itself), and implement transitions.
				While this could all be defined inside of an extention of the setState() method,
				it is better to break it up into more managable pieces, and not worry about the method overrides.
				Example: this.setState_stateId = function(useTransition, reverse, onComplete){//(Boolean, Boolean, Function):void
					var _this = this;
					if(useTransition){
						$(someChild).transition({opacity:1, duration:1000, complete:onComplete});
					}else{
						$(someChild).css({display:'block', opacity1});
						onComplete();
					}
				}
		*/
		
		var State = pulley.view.State;
		var ViewController = pulley.view.ViewController;
		
		var _this = this;
		logMethod(this, 'setState', arguments);
		var state = null;//State
		if(isNumber(state_or_stateIndex)){
			state = this.states[state_or_stateIndex];
		}else if(state_or_stateIndex instanceof State){
			state = state_or_stateIndex;
		}
		if(!state){
			console.error('invalid state');
			return;
		}
		var reverse = null;
		var stateIsChanging = (this.currentState != state);
		if(stateIsChanging){//If the state is changing...
			this.previousState = this.currentState;//Set the current state to the previous state.
			this.currentState = state;//Define the new state
			_this.dispatchEvent(ViewController.STATE_CHANGED);//, {newState: _this.currentState, oldState:_this.previousState});//I am not passing through the states as data, because it may not have been the state of the current level. It may be substates that changed. These can still be referenced via the instance vars.
			reverse = this.areStatesInReverseOrder(this.previousState, this.currentState);//Determine if it is moving to an earlier state.
			//Set the state's model, if desired.
			if(stateModel && this.currentState.view.setModel){
				this.currentState.view.setModel(stateModel);
			}
		}
		
		//Hide all states except for the currentState and previousState. Also set opacity to 0 so it is ready for fade in.
		for(var i in this.states){
			var state = this.states[i];
			if(state != this.currentState && state != this.previousState){
				if(state.view instanceof ViewController){
					state.view.$view.css({display:'none', opacity:0});
				}else{
					$(state.view).css({display:'none', opacity:0});
				}
			}
		}
		
		//Set the size of the currentState.
		if(this.currentState.view){//If the current state has a view,
			if(this.currentState.view.setSize){//And that view is a ViewController,
				window.requestAnimationFrame(function(){//Set its size, since it is now on the stage.
					if(_this.currentState.view){
						if(_this.currentState.view.setSize){
							_this.currentState.view.setSize();
						}
					}
				});
			}
		}
		
		//Hide the old state, and show the new state. Also set opacity to 0 on hide so it is ready for fade in.
		if(!useTransition){//If not using a transition, then this can handle the showing/hiding for you.
			//Hide the old state
			if(stateIsChanging){
				if(this.previousState){
					if(this.previousState.view instanceof ViewController){
						this.previousState.view.$view.css({display:'none', opacity:0});
					}else{
						$(this.previousState.view).css({display:'none', opacity:0});
					}
				}
			}
			//Show the new state.
			if(this.currentState.view instanceof ViewController){
				this.currentState.view.$view.css({display:'block', opacity:1});
			}else{
				$(this.currentState.view).css({opacity:1});
			}
		}
		
		//Call the custom implementation method.
		if(this.currentState.implementation){
			//this.currentState.implementation(false, reverse, onComplete);//Using this method causes scope to be lost.
			this.setSize();
			this.currentState.implementation.call(this, useTransition, reverse, done);//Use the "call" function to pass the right scope through as the first parameter. On the receiving end, the first parameter is omited.
		}else{
			done();
		}
		
		function done(){
			_this.apply();
			_this.setSize();
			if(_this.currentState.view.focus){
				_this.currentState.view.focus();
			}
			if(stateIsChanging){
				if(_this.previousState){
					if(_this.previousState.view){
						_this.previousState.view.removeEventListener(ViewController.STATE_CHANGED, _this._currentState__onStateChanged);
					}
				}
			}
			if(_this.currentState.view){
				_this.currentState.view.addEventListener(ViewController.STATE_CHANGED, _this, _this._currentState__onStateChanged);
			}
			if(onComplete){
				onComplete();
			}
		}
	}
	/*function getController()
	{
		var result = this;
		result.beans = 'franks';
		return result;
	}*/
	this._currentState__onStateChanged = function(event, data){
		//var _this = event.data.scope;
		this.dispatchEvent(ViewController.STATE_CHANGED);//This effectively bubbles the event up.
	}
	this.getStateIndex = function(state){//(State):int
		for(var i in this.states){
			var state2 = this.states[i];
			if(state == state2){
				return eval(i);
			}
		}
	}
	this.getPreviousStateByOrder = function(excludeModalStates){//Not to be confused with this.previousState
		if(excludeModalStates == null){
			excludeModalStates = true;
		}
		var currentStateIndex = this.getStateIndex(this.currentState);
		for(var i = currentStateIndex-1; i<this.states.length; i--){
			if(i<0){
				return null;
			}
			var previousState = this.states[i];
			if(excludeModalStates){
				if(previousState.type != State.TYPE__MODAL){
					return previousState;
				}
			}else{
				return previousState;
			}
		}
	}
	this.getNextStateByOrder = function(excludeModalStates){
		if(excludeModalStates == null){
			excludeModalStates = true;
		}
		var currentStateIndex = this.getStateIndex(this.currentState);
		for(var i = currentStateIndex+1; i<this.states.length; i++){
			var nextState = this.states[i];
			if(excludeModalStates){
				if(nextState.type != State.TYPE__MODAL){
					return nextState;
				}
			}else{
				return nextState;
			}
		}
	}
	this.getLastState = function(excludeModalStates){
		if(excludeModalStates == null){
			excludeModalStates = true;
		}
		for(var i=this.states.length-1; i>-1; i--){//Go through states backwards.
			var state = this.states[i];
			if(excludeModalStates){
				if(state.type != State.TYPE__MODAL){
					return state;
				}
			}else{
				return state;
			}
		}
	}
	this.getStateByHash = function(hash){//(String):State
		if(hash.indexOf('#') > -1){
			hash = hash.substring(hash.indexOf('#') + 1, hash.length);
		}
		var hashParts = parseHash(hash);//Array of strings.
		var hash0 = hashParts[0];
		var foundState = null;
		for(var i in this.states){
			var state = this.states[i];
			if(state.hash == hash0){
				return state;
			}
		}
		return null;
	}
	this.setStateByHash = function(hash, stateModel, useTransition, onComplete){//(String, Boolean, Function):void
		if(hash.indexOf('#') > -1){
			hash = hash.substring(hash.indexOf('#')+1, hash.length);
		}
		var hashParts = parseHash(hash);//Array of strings.
		var hash0 = hashParts[0];
		var foundState = this.getStateByHash(hash);
		if(!foundState && this.states[0]){
			foundState = this.states[0];//Fallback
		}
		
		var subStateHashParts = hashParts.slice(1);//Exclude the first hash part.
		if(subStateHashParts.length){
			//Set the state, but explicitly tell it not to set the substate.
			this.setState(foundState, stateModel, useTransition, onComplete, false);//(state:State, useTransition:Boolean, setSubstate:false):void
			//Set the substate based on the hash.
			var subStateHashString = subStateHashParts.join('/');
			if(foundState.view){
				foundState.view.setStateByHash(subStateHashString, useTransition);
			}
		}else{
			//Otherwise, set the state let it automatically choose the right substate.
			if(foundState){
				this.setState(foundState, useTransition, onComplete, true);//(state:State, useTransition:Boolean, setSubstate:false):void
			}
		}
	}
	function parseHash(hash){//(String):Array of Strings
		var dirtyHashParts = hash.split('/');
		var hashParts = [];
		for(var i in dirtyHashParts){
			var hashPart = dirtyHashParts[i];
			if(hashPart){
				hashParts.push(hashPart);
			}
		}
		return hashParts;
	}
	/*function getHash(){
		var value = this.hash;
		if(this.currentState){
			if(this.currentState.view){
				value += this.currentState.getHash();
			}
		}
		return value;
	}*/
	this.areStatesInReverseOrder = function(state1, state2){
		var value = null;
		var forceReverse = null;
		/*if(this.states.length > 1){ //I commented this out, because it is not clear if/when it is needed.
			var lastState = this.states[this.states.length-1];
			var secondLastState = this.states[this.states.length-2];
			forceReverse = (this.currentState == lastState && this.previousState != secondLastState);//If this is the last state, and the old state is not the second-last state, then it needs to play the transition in reverse.
		}*/
		if(forceReverse){
			value = true;//This is only called when going from the next slide, in reverse to the last state.
		}else{
			value = (this.getStateIndex(state1) > this.getStateIndex(state2));
		}
		return value;	
	}
	
	
	//Locking
	this.isLocked = function(){
		if(this._locks.length){
			return true;
		}else{
			return false;
		}
	}
	this.lock = function(id){
		if(!id){
			console.error('You must provide a lock id.');//The GUID helps ensure that locks are programmed cleanly, and makes it easy to locate uncleaned locks.
		}
		this._locks.push(id);
		if(this._locks.length == 1){
			this.$view.addClass('locked');
		}
	}
	this.unlock = function(id){
		if(this._locks <= 0){
			console.error('The app is not locked. Make sure that each lock() and unlock() call has a pair.');
		}
		var foundAndRemoved = null;
		for(var i in this._locks){
			if(this._locks[i] == id){
				this._locks.splice(i, 1);//Remove that lock.
				foundAndRemoved = true;
			}
		}
		if(!foundAndRemoved){
			console.error('No lock with id '+id+' was found.');
		}
		if(this._locks.length == 0){
			this.$view.removeClass('locked');
		}
	}
}


//EXTEND
pulley.view.ViewController = pulley.Controller.extend(new pulley.view.ViewController());
pulley.view.ViewController.type = 
pulley.view.ViewController.prototype.type = 'pulley.view.ViewController';


//STATIC VARS
pulley.view.ViewController.STATE_CHANGED = 'stateChanged';


//STATIC METHODS
pulley.view.ViewController.createUniqueId = function(viewControllerInstance){
	var objectPrototype = viewControllerInstance.__proto__;
	if(!objectPrototype) objectPrototype = viewControllerInstance.prototype;
	var uniqueId = null;
	if(objectPrototype){
		if(objectPrototype.instanceCounter == null) objectPrototype.instanceCounter = -1;
		objectPrototype.instanceCounter++;
		uniqueId = objectPrototype.instanceCounter;
	}else{
		uniqueId = Math.floor(Math.random()*10000000);
	}
	var type = viewControllerInstance.type;
	if(!type) type = viewControllerInstance.localName;
	var id = type + '_' + uniqueId;
	return id;
}


/*****
End Class: ViewController
*****/








/*****
Class: State
Extends: Class
Notes: All view classes should extend this class. It adds additional methods that are needed throughout the app.
*****/
pulley.view.State = function(){
	
	this.init = function(args){//(Object):State
		this.id = null;//String referenced by JavaScript.
		this.name = null;//String used in the app.
		this.hash = null;//String in the URL
		this.implementation = null;//Function that lays out the state.
		this.view = null;//DOM Element
		this.type = null;//String of enumerable 'type' (see below).
		
		for(var i in args){
			this[i] = args[i];
		}
		if(!this.type){
			this.type = State.TYPE__PAGE;
		}
		
		return this;
	}
	this.getHash = function(){
		var value = this.hash;
		if(this.view){
			if(this.view.currentState){
				var subHash = this.view.currentState.getHash();
				if(subHash){
					value += '/' + subHash;
				}
			}
		}
		if(!value){//Prevent null from being turned into a string.
			value = '';
		}
		return value;
	}
}


//EXTEND
pulley.view.State = Class.extend(new pulley.view.State());
pulley.view.State.type = 
pulley.view.State.prototype.type = 'pulley.view.State';


//STATIC VARS
pulley.view.State.TYPE__PAGE = 'page';//Default
pulley.view.State.TYPE__MODAL = 'modal';
pulley.view.State.TYPE__TRANSITION = 'transition';


//STATIC METHODS
//pulley.view.State.staticMethod = function(){};


/*****
End Class: State
*****/





