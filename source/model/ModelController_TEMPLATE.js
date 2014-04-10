/*****
Class: FooModel
Extends: ModelController, Controller
Notes: 
*****/
company.project.model.valueobject.FooModel = function(){
	
	//IMPORT
	//var FooModel = company.project.model.valueobjects.FooModel;
	
	//var myPrivateVar = null;//Call without 'this'. Does not work since it can only access the prototype and not the instance.
	//this.myPublicVar = null;//Call with 'this'.
	
	//function myPrivateMethod(){};//Call via myPrivateMethod(). Does not work since it can only access the prototype and not the instance.
	//this.myPublicMethod = function(){};//Must be public to override. Call via this.myPublicMethod().
	
	this.init = function(initObj, onComplete){
		
		//PROPERTIES
		//this.id //String (Defined in super.)
		//this.type //String (Defined in super.)
		this.propA = null;//String
		
		this._super(initObj);//Call after setting properties. Don't pass through onComplete
		
		if(onComplete) onComplete();
	}
	
	
	//OVERRIDE ModelController
	/*this.setModel = function(model){//(FooModel):void
		this._super(model);
	}*/
	
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
company.project.model.valueobject.FooModel = pulley.model.ModelController.extend(new company.project.model.valueobject.FooModel());
company.project.model.valueobject.FooModel.type = 
company.project.model.valueobject.FooModel.prototype.type = 'company.project.model.valueobject.FooModel';


//STATIC VARS
//company.project.model.valueobject.FooModel.staticVar = null;


//STATIC METHODS
//company.project.model.valueobject.FooModel.staticMethod = function(){};


/*****
End Class: FooModel
*****/