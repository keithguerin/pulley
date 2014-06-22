/*****
Class: Pulley.view.controls.NavBarModel
Extends: Backbone.Model
Notes: 
*****/

registerNamespace('Pulley.view.controls');
Pulley.view.controls.NavBarModel = function(){
	
	var NavBarModel = Pulley.view.controls.NavBarModel;
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
		this.left = null;//String, or Array of Elements or Pulley.Views
		this.middle = null;//String
		this.right = null;//String, or Array of Elements or Pulley.Views
		
		this._super(initObj);//Call after setting properties. Don't pass through onComplete
		
		if(onComplete) onComplete();
	}
	
	
	//OVERRIDE ModelController
	/*this.setModel = function(model){//(NavBarModel):void
		this._super(model);
	}*/
	this.setModel_left = function(model){//(String of HTML, Element, or Array of Elements):void
		this.left = model;
		this.dispatchEvent(Pulley.view.controls.NavBarModel.CHANGED);
	}
	this.setModel_right = function(model){//(String of HTML, Element, or Array of Elements):void
		this.right = model;
		this.dispatchEvent(Pulley.view.controls.NavBarModel.CHANGED);
	}
	this.setModel_middle = function(model){//(String of HTML, Element, or Array of Elements):void
		this.middle = model;
		this.dispatchEvent(Pulley.view.controls.NavBarModel.CHANGED);
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
Pulley.view.controls.NavBarModel = Backbone.Model.extend(new Pulley.view.controls.NavBarModel());
Pulley.view.controls.NavBarModel.type = Pulley.view.controls.NavBarModel.prototype.type = 'Pulley.view.controls.NavBarModel';


//STATIC VARS
Pulley.view.controls.NavBarModel.CHANGED = 'changed';


//STATIC METHODS
//Pulley.view.controls.NavBarModel.staticMethod = function(){};


/*****
End Class: NavBarModel
*****/










/*****
Class: Pulley.view.controls.NavBar
Extends: Pulley.View, Pulley.Controller
Notes: 
*****/

registerNamespace('Pulley.view.controls');

Pulley.view.controls.NavBar = function(){
	
	this.init = function(){//(arguments):void (Arguments are different, whether using Angular or Pulley)
		
		//SETTINGS
		//this.settings_defaults = {};
		
		if(this.initializedByAngular){
			this._super.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		}else{//Using Pulley patterns
			var view_temp = arguments[0];
			var model_temp = arguments[1];
			var settings_temp = arguments[2];
			var onComplete = arguments[3];
			this._super(view_temp, model_temp, settings_temp);//Don't pass through onComplete.
		}
		
		//MODEL
		//this.model.valueA = null;
		
		//VIEW
		this.children.left = this.$('>.inner >.left')[0];
		this.children.middle = this.$('>.inner >.middle')[0];
		this.children.right = this.$('>.inner >.right')[0];
			
		//CONTROLLER
		/*this.states = [
			new Pulley.view.State({
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
	
	
	//EXTEND Pulley.View
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
			this.model.addEventListener(Pulley.view.controls.NavBarModel.CHANGED, this, this.model_onChanged);//(eventName, originalScope, listenerFunction)
		
			//SET MODEL TO CHILDREN
			//
		}
		
		//UPDATE THE VIEW
		this.render();
		
		if(hasModelChanged){
			//goto();
		}
	}
	this.render = function(){//(void):void
		this._super();
		
		//RESET UI AS NEEDED
		this.children.left.innerHTML = '';
		this.children.middle.innerHTML = '';
		this.children.right.innerHTML = '';
		
		//RENDER MODEL
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
				}else if(partModel instanceof Pulley.View){
					$content = partModel.$el;
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
		var lockId = 'NavBar.setState_stateId '+Math.random();
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
		if(__config.logging) log('NavBar._render()');
		this.render();
	}
	
}


//EXTEND
Pulley.view.controls.NavBar = Pulley.View.extend(new Pulley.view.controls.NavBar());
Pulley.view.controls.NavBar.type = 
Pulley.view.controls.NavBar.prototype.type = 'Pulley.view.controls.NavBar';


//STATIC VARS
//Pulley.view.controls.NavBar.staticVar = 'staticVar';


//STATIC METHODS
Pulley.view.controls.NavBar.getClassNameByLabel = function(label){//(String):String
	var className = label.toCamelCase()+'Button';
	return className;
}


/*****
End Class: NavBar
*****/


