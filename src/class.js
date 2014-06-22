/*****
Class: Pulley.Class
Extends: noe
Notes: This object follows the same patterns as Backbone.Model. It allows you to create an object that has inheritance, and initization just like Backbone.Model.
*****/


registerNamespace('Pulley');
Pulley.Class = function (options) {
	this.cid = _.uniqueId('c');
	Pulley.Class.applyAttributesToObject(options, this);
	this.initialize.apply(this, arguments);
};
_.extend(Pulley.Class.prototype, Backbone.Events, {});
Pulley.Class.extend = Backbone.Model.extend; //Set up inheritance, from Backbone.
Pulley.Class.type = Pulley.Class.prototype.type = 'Pulley.Class';


//STATIC VARS
//Pulley.Class.STATIC_VAR = 'myStaticVar';


//STATIC METHODS
Pulley.Class.applyAttributesToObject = function (options, object) {
	if(options){
		for(var optionAttr in options){
			var isBackboneOption2 = isBackboneOption(optionAttr);
			if(!isBackboneOption2){ //Don't apply options that Backbone.View will apply.
				var optionValue = options[optionAttr];
				object[optionAttr] = optionValue; 
			}
		}
	}
	function isBackboneOption(option2){
		var backboneOptions = ['model', 'collection', 'el', 'id', 'className', 'tagName', 'attributes', 'events'];
		for(var j in backboneOptions){
			if(option2 == backboneOptions[j]){
				return true;
			}
		}
		return false;
	}
}


/*****
End Class: Pulley.Class
*****/
