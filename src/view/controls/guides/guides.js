/*****
Class: pulley.view.controls.GuidesVC
Extends: ViewController, Controller
Notes: 
*****/

registerNamespace('pulley.view.controls');

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



