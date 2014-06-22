/*****
Module: Pulley.Module
Extends: Pulley.Model, Backbone.Model
Notes: 
*****/


registerNamespace('Pulley');
Pulley.Module = function (options) {
	Pulley.Module.applyAttributesToObject(options, this);
	/*var attrs = attributes || {};
	options || (options = {});
	this.cid = _.uniqueId('c');
	this.attributes = {};
	if (options.collection) this.collection = options.collection;
	if (options.parse) attrs = this.parse(attrs, options) || {};
	attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
	this.set(attrs, options);
	this.changed = {};*/
	this.initialize.apply(this, arguments);
};
_.extend(Pulley.Module.prototype, Backbone.Events, {});
Pulley.Module.extend = Backbone.Model.extend; //Set up inheritance, from Backbone.
Pulley.Module.type = Pulley.Module.prototype.type = 'Pulley.Module';


//STATIC VARS
//Pulley.Module.STATIC_VAR = 'myStaticVar';


//STATIC METHODS
Pulley.Module.applyAttributesToObject = function (options, object) {
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
End Module: Pulley.Module
*****/
