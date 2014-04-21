/*****
Class: company.project.model.valueobjects.FooModel
Extends: ModelController, Controller
Notes: 
*****/

registerNamespace('company.project.model.valueobjects');

company.project.model.valueobjects.FooModel = function(){
	
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
company.project.model.valueobjects.FooModel = pulley.model.ModelController.extend(new company.project.model.valueobjects.FooModel());
company.project.model.valueobjects.FooModel.type = 
company.project.model.valueobjects.FooModel.prototype.type = 'company.project.model.valueobjects.FooModel';


//STATIC VARS
//company.project.model.valueobjects.FooModel.staticVar = null;


//STATIC METHODS
//company.project.model.valueobjects.FooModel.staticMethod = function(){};


/*****
End Class: FooModel
*****/