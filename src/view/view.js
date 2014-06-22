/*****
Class: Pulley.View
Extends: Backbone.View
Notes: All view classes should extend this class. It adds additional methods that are needed throughout the app.
*****/


registerNamespace('Pulley.view');
Pulley.View = Backbone.View.extend({
	
	
	//Override Backbone.View vars
	tagName: 'div',
	className: 'view',
	//model: null, // Backbone.Model
	template: Handlebars.compile('<div class="view">Template goes here</div>'),
	//template: Handlebars.compile($("#view-template").html()),
	//el
	//$el
	//attributes
	defaults: {
		//id: null, // integer
	},
	/*events: {
		'click .openbutton': 'open'
	},*/
	
	
	//Module vars
	stateContainer: null, // The container that state views are inserted into. Defaults to el if undefined.
	setWidth: null, // Number
	setHeight: null, // Number
	_locks: [], // Array of GUID Numbers.
	previousState: null, // Pulley.view.State
	currentState: null, // Pulley.view.State
	states: [], // Array of Pulley.view.States
	
	
	initialize: function (options) { //Valid options: model, collection, el, id, className, tagName, attributes and events
		//Unneccessary to call super.
		this.type = this.__proto__.type;
		Pulley.Class.applyAttributesToObject(options, this);
		
		if(!this.children){
			this.children = {};
		}
		
		//Keep all active controllers in the window object, so we can find them if needed. They are automatically removed on destroy.
		//Use the method c('myFoo') to find controllers by id.
		this._createGlobalReference();
		
		//Mark the view as initialized, to prevent it from being auto-initialized again.
		this.initialized = true;
		//this.$el.attr('data-initialized','true');
		//this.$el.attr('data-cid', this.cid);
		this.render();
	},
	
	render: function () {
		//Pulley.View.prototype.render.apply(this, arguments); // Call super.
		if(!this.drawn){
			this.drawn = true;
			var html = this.template(this);
			this.setElement($(html)[0]); //Calls Pulley.View.setElement() to replace the reference and the element on stage.
			//this.$el.html(html); //Replace element's contents
			
			Pulley.View.autoinitializeViews(this.el); // Auto-initialize children.
			//var fooEl = this.$('.foo')[0];
			//this.children.foo = window._views[fooEl.id];
		}
		return this; //Enable chained calls.
	},
	
	setElement: function(el) {
		if(this.$el){
			this.$el.replaceWith(el); //Replace element on the stage first, since Backbone doesn't do this.
		}
		Backbone.View.prototype.setElement.apply(this, arguments); //Then update our reference and event binding.
		return this;
	},
	
	
	//Define module methods
	setModel: function (model) {
		this.model = model;
		this.render();
		if(this.model instanceof Backbone.Model || this.model instanceof Backbone.Collection) {
			this.listenTo(this.model, 'change', this.render);
		}
	},
	
	_createGlobalReference: function () {
		if(!window._views){
			window._views = [];
			window.getView = window.c = Pulley.View.getView;
			window.addView = Pulley.View.addView;
		}
		window.addView(this);
	},
	
	_defineDeclarativeStates: function () {
		//You can automatically create states by defining them in HTML.
		//This works well if you simply want to switch between views, without using transitions or change anything else.
		//Declare a state like this:
		//	Example: <div data-state-id='home' data-state-implementation-method='setState_stateId'></div>
		var stateCandidates = _this.$('[data-state-id]').toArray();
		if(stateCandidates.length){//Quickly check if there are any HTML-defined states, before searching the whole tree in detail.
			var declarativeStates = findStatesInChild(_this.el);
			_this.states = _this.states.concat(declarativeStates);//Add these states, in addition to those defined in script.
		}
		
		function findStatesInChild(element){
			var states2 = [];
			for(var i=0; i<element.children.length; i++){
				var childElement = element.children[i];
				if(childElement.hasAttribute('data-state-id')){//If this element is a state, add it to the array.
					var stateId = $(childElement).attr('data-state-id');//String
					var stateLabel = $(childElement).attr('data-state-label');//String
					var stateType = $(childElement).attr('data-state-type');//String (Enum)
					var stateImplementationMethodName = $(childElement).attr('data-state-implementation-method');//String
					if(stateImplementationMethodName){
						var stateImplementationMethod = _this[stateImplementationMethodName];//Function
						if(!stateImplementationMethod){
							console.error('No function with this name found.');
						}
					}
					var state = new Pulley.view.State({
						id:stateId,
						label:stateLabel,
						type:stateType,
						implementation:stateImplementationMethod,
						view:childElement
					});
					//Replace the view with its View if it has one.
					var childElementVC = c(childElement.id);
					if(childElementVC){
						state.view = childElementVC;
					}
					states2.push(state);
					
				}else if(!childElement.hasAttribute('data-initialized')){//Don't look for states inside of other Views.
					var childStates = findStatesInChild(childElement);
					states2 = states2.concat(childStates);//Add child states to the list of states.
				}
			}
			return states2;
		}
	},
	
	reset: function (resetModel) { //(Boolean):void
		//logMethod(this, 'reset', arguments);
		if(resetModel){
			this.destroy();
			this.init();
		}else{
			//this.setState(null, stateModel, false);
		}
	},
	
	focus: function () { //():void
		//logMethod(this, 'focus', arguments);
	},
	
	setSize: function (w, h) { //(int, int):void
		//logMethod(this, 'setSize', arguments);
		if(w >= 0){
			this.$el.width(w);
		}
		if(h >= 0){
			this.$el.width(h);
		}
		if(this.children){
			for(var i in this.children){
				var child = this.children[i];
				if(child){
					if(child.setSize){
						child.setSize();
					}
				}
			}
		}
	},
	
	isLocked: function () {
		if(this._locks.length){
			return true;
		}else{
			return false;
		}
	},
	
	lock: function (id) {
		if(!id){
			console.error('You must provide a lock id.');//The GUID helps ensure that locks are programmed cleanly, and makes it easy to locate uncleaned locks.
		}
		this._locks.push(id);
		if(this._locks.length == 1){
			this.$el.addClass('locked');
		}
	},
	
	unlock: function (id) {
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
			this.$el.removeClass('locked');
		}
	},
	
	
	/***** STATE MANAGEMENT *****/
	setState: function (stateArg, stateModel, useTransition, onComplete) { //(State or Number, Boolean, Function):void
		
		/*
			
			The stateArg can be:
			a. an instance of Pulley.view.State.
			b. a State's id (String). i.e. 'dashboard'
			c. a path of multiple state id's. i.e. 'dashboard/executive'
			
			**********
			
			Use this method to manage the state of the Pulley.View. This is better than having custom goToSection/Part/Page methods.
			Instructions:
			1. Add the class 'view__state' to each element that you want to represent a state.
				Everything in this state will be automatically turned on and off.
				It also needs a unique class that matches the stateId.
				Example: <div class='view__state Foo__state1'></div>
				
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
		
		var State = Pulley.view.State;
		
		var _this = this;
		logMethod(this, 'setState', arguments);
		
		var state;
		var subState;
		if(isPath(stateArg)){ //If a path is provided, find the matching state, and create a substate string to pass on down.
			var pathParts = parsePath(stateArg);
			if(!pathParts.length) pathParts = null;
			state = this.getState(pathParts[0]);
			if(pathParts.length > 1){
				subState = pathParts.slice(1).join('/');
			}
			
		}else if(stateArg){ //Find the state if a number, string, or state are provided.
			state = this.getState(stateArg);
			if(!state){
				console.error('invalid state');
			}
			
		}else{ //Use the default state if none specified.
			state = this.states[0];
		}
		if(!state){
			return;
		}
		
		var reverse = null;
		var stateIsChanging = (this.currentState != state); 
		if(stateIsChanging){//If the state is changing...
			this.previousState = this.currentState;//Set the current state to the previous state.
			this.currentState = state;//Define the new state
			reverse = this._areStatesInReverseOrder(this.previousState, this.currentState);//Determine if it is moving to an earlier state.
		}
		
		//Hide the old state, and show the new state. Also set opacity to 0 on hide so it is ready for fade in.
		if(!useTransition){//If not using a transition, then this can handle the showing/hiding for you.
			//Hide the old state
			if(stateIsChanging){
				if(this.previousState){
					var previousViewElement = (this.previousState.view instanceof Pulley.View)?
						this.previousState.view.$el[0] : this.previousState.view;
					if(previousViewElement.parentElement){
						previousViewElement.parentElement.removeChild(previousViewElement);
					}
				}
			}
			
			//Create the view if it doesn't yet exist.
			if(!this.currentState.view){
				this.currentState.view = new this.currentState.viewClass();
			}
			
			//Set the state's model, if desired.
			if(stateModel && this.currentState.view.setModel){
				this.currentState.view.setModel(stateModel);
			}
			
			//Show the new state.
			var currentViewElement = null;
			if(this.currentState.view instanceof Pulley.View){ //If it is a Pulley.View instance.
				currentViewElement = this.currentState.view.el;
			}else{ //Otherwise, assume it is an element.
				currentViewElement = this.currentState.view;
			}
			if(!this.stateContainer){
				this.stateContainer = this.el;
			}
			this.stateContainer.appendChild(currentViewElement);
			
			//Set the substate of the new state. (Pass a null substate to reset to the default state.)
			if(this.currentState.view instanceof Pulley.View){
				this.currentState.view.setState(subState);
			}
			
			this.trigger(Pulley.View.STATE_CHANGED);//, {newState: _this.currentState, oldState:_this.previousState});//I am not passing through the states as data, because it may not have been the state of the current level. It may be substates that changed. These can still be referenced via the instance vars.
		}
		
		//Set the size of the currentState.
		if(this.currentState.view){//If the current state has a view,
			if(this.currentState.view.setSize){//And that view is a Pulley.View,
				window.requestAnimationFrame(function(){//Set its size, since it is now on the stage.
					if(_this.currentState.view){
						if(_this.currentState.view.setSize){
							_this.currentState.view.setSize();
						}
					}
				});
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
			_this.render(); 
			_this.setSize();
			//Focus the new view.
			if(_this.currentState.view){
				if(_this.currentState.view.focus){
					_this.currentState.view.focus();
				}
			}
			//Stop listening to the previous view.
			if(stateIsChanging){
				if(_this.previousState){
					if(_this.previousState.view){
						if(_this.previousState.view instanceof Pulley.View){
							_this.stopListening(_this.previousState.view, Pulley.View.STATE_CHANGED, _this._currentState__onStateChanged);
						}
					}
				}
			}
			//Listen to the new view.
			if(_this.currentState.view){
				if(_this.currentState.view instanceof Pulley.View){
					_this.listenTo(_this.currentState.view, Pulley.View.STATE_CHANGED, _this._currentState__onStateChanged);
				}
			}
			if(onComplete){
				onComplete();
			}
		}
	},
	
	_currentState__onStateChanged: function (event, data) {
		//var _this = event.data.scope;
		this.trigger(Pulley.View.STATE_CHANGED);//This effectively bubbles the event up.
	},
	
	getStateIndex: function (state) { // (State):int
		for(var i in this.states){
			var state2 = this.states[i];
			if(state == state2){
				return eval(i);
			}
		}
	},
	
	getPreviousStateByOrder: function (excludeModalStates) { // Not to be confused with this.previousState
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
				if(previousState.TYPE != Pulley.view.State.TYPE__MODAL){
					return previousState;
				}
			}else{
				return previousState;
			}
		}
	},
	
	getNextStateByOrder: function (excludeModalStates) {
		if(excludeModalStates == null){
			excludeModalStates = true;
		}
		var currentStateIndex = this.getStateIndex(this.currentState);
		for(var i = currentStateIndex+1; i<this.states.length; i++){
			var nextState = this.states[i];
			if(excludeModalStates){
				if(nextState.TYPE != Pulley.view.State.TYPE__MODAL){
					return nextState;
				}
			}else{
				return nextState;
			}
		}
	},
	
	getLastState: function (excludeModalStates) {
		if(excludeModalStates == null){
			excludeModalStates = true;
		}
		for(var i=this.states.length-1; i>-1; i--){//Go through states backwards.
			var state = this.states[i];
			if(excludeModalStates){
				if(state.TYPE != Pulley.view.State.TYPE__MODAL){
					return state;
				}
			}else{
				return state;
			}
		}
	},
	
	getState: function (stateArg) { // (String):State
		var state;
		if(isString(stateArg)){
			for(var i in this.states){
				state = this.states[i];
				if(state.id == stateArg){
					return state;
				}
			}
		}else if(isNumber(stateArg)){
			state = this.states[stateArg];
			return state;
		}else if(stateArg instanceof Pulley.view.State){
			state = stateArg;
			return state;
		}
		var doError = false;
		if(doError){
			console.error('Invalid argument provided.');
		}else{
			var notFoundState = new Pulley.view.State({
				id: '404',
				name: 'Page Note Found',
				//viewClass: Leviathan.Lotan.View,
				view: $('<div>404: Page not found</div>')[0]
			})
			return notFoundState;
		}
	},
	
	_areStatesInReverseOrder: function(state1, state2){
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
	},
	
	/***** /State Management *****/
	
});
Pulley.View.type = Pulley.View.prototype.type = 'Pulley.View';


//STATIC VARS
Pulley.View.STATE_CHANGED = 'stateChanged';


//STATIC METHODS

//This goes through the HTML of a DOMElement and initializes any controllers.
//Controllers are defined in HTML like this: <div class="Clip">stuff</div>. This looks for a controller with name ClipVC.
Pulley.View.autoinitializeViews = function (containerElement) {
	//logMethod(this, '_initializeViews', arguments);
	var elementsToInitialize = _getUninitializedViewsWithinElement(containerElement);
	var views = [];
	for(var i in elementsToInitialize){
		var el = elementsToInitialize[i];
		var $el = $(el);
		var viewControllerName = $el.attr('data-view');
		var viewControllerClass = Pulley.View.getViewByNamespace(viewControllerName);
		if(viewControllerClass){
			var args = {
				el: el
			}
			var model = $el.attr('data-model');
			if(model) args.model = JSON.parse(model);
			var settings = $el.attr('data-settings');
			if(settings) args.settings = JSON.parse(settings);
			var view = new viewControllerClass(args); //Pass in the view, so it has a reference.
			views.push(view);
		}
	}
	return views;
	
	function _getUninitializedViewsWithinElement(containerElement){
		var elementsWithControllers = $(containerElement).find('*[data-view]').toArray();
		var result = [];
		for(var i in elementsWithControllers){
			var el = elementsWithControllers[i];
			var elementIsAlreadyInitialized = ($(el).attr('data-initialized') == 'true');
			if(!elementIsAlreadyInitialized){
				result.push(el);
			}
		}
		return result;
	}
}

Pulley.View.getViewByNamespace = function(namespaceString){//String, example: Pulley.view.controls.NavBarVC
	var namespacesArray = namespaceString.split(".");;//Array example, ['Pulley','view','controls','NavBarVC'];
	var parentNamespace = window;
	var controller = null;
	for(var i in namespacesArray){
		var childNamespace = namespacesArray[i];
		if(i < namespacesArray.length - 1){
			parentNamespace = parentNamespace[childNamespace];
			if(!parentNamespace){
				e.e;//Invalid namespace.
			}
		}else{
			controller = parentNamespace[childNamespace];
			break;
		}
	}
	return controller;
}

Pulley.View.getView = function (elementOrClientId) {
	/*for(var i in window._views){
		var viewController = window._views[i];
		if(viewController.cid == cid){
			return viewController;
		}
	}*/
	var elementClientId = null;
	if(elementOrClientId instanceof Element){
		var el = elementOrClientId;
		elementClientId = $(el).attr('data-cid');
	}else{
		elementClientId = elementOrClientId;
	}
	var view = window._views[elementClientId];
	return view;
}

Pulley.View.addView = function (view) {
	view.$el.attr('data-cid', view.cid)
	window._views[view.cid] = view;
}


/*****
End Class: Pulley.View
*****/
























/*****
Class: State
Extends: Class
Notes: All view classes should extend this class. It adds additional methods that are needed throughout the app.
*****/

Pulley.view.State = function (attributes, options) {
	
	this.id = null; // String referenced by JavaScript, and the URL hash.
	this.label = null; // String used in the app.
	this.type = null; // String of enumerable 'type' (see below).
	this.implementation = null; // Function that lays out the state.
	this.viewClass = null; // View Class
	this.view = null; // View Instance or DOM Element
	
	//Constructor
	this.type = this.__proto__.type;
	if(!this.type){
		type = Pulley.view.State.prototype.type;
	}
	for(var attr in attributes){
		var value = attributes[attr];
		this[attr] = value;
	}

	//Assign defaults.
	if(!this.id && !(this.id == 0)){
		console.error('You must provide an id to create a State.');
	}
	if(!this.type) this.type = Pulley.view.State.TYPE__PAGE;
	if(!this.view && !this.viewClass){
		console.error('You must provide a view or viewClass to create a State.');
	}
	
};


//EXTEND
Pulley.view.State.type = 
Pulley.view.State.prototype.type = 'Pulley.view.State';


//STATIC VARS
Pulley.view.State.TYPE__PAGE = 'page';//Default
Pulley.view.State.TYPE__MODAL = 'modal';
Pulley.view.State.TYPE__TRANSITION = 'transition';


//STATIC METHODS
//Pulley.view.State.staticMethod = function () {}


/*****
End Class: Pulley.view.State
*****/





