/*****
Class: NavBarModel
Extends: ModelController, Controller
Notes: 
*****/

registerNamespace('pulley.view.controls');

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


