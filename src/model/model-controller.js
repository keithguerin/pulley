/*****
Class: ModelController
Extends: Controller
Notes: 
*****/

registerNamespace('pulley.model');

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