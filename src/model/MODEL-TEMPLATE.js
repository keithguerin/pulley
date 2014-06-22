/*****
Module: Pulley.model.Foo
Extends: Pulley.Model, Backbone.Model
Notes: 
*****/


registerNamespace('Pulley.model');
Pulley.model.Foo = Pulley.Model.extend({
	
	
	defaults: {
		id: null, // integer
	},
	
	
	//Override Backbone.Model
	initialize: function (attributes, options) {
		this.type = this.__proto__.type;
	},
	
	urlRoot: __config.APIRootURL + 'foos',
	clientUrlRoot:  + 'foos',
	
	/*
	keys, values, pairs, invert, pick, omit //Extend Underscore
	get: function (attribute) {},
	set: function (attributes, [options]) {},
	escape: function (attribute) {},
	has: function (attribute) {},
	unset: function (attribute, [options]) {},
	clear: function ([options]) {},
	toJSON: function ([options]) {},
	sync: function (method, model, [options]) {},
	fetch: function ([options]) {},
	save: function ([attributes], [options]) {},
	destroy: function ([options]) {},
	validate: function (attributes, [options]) {},
	isValid: function () {},
	url: function () {},
	urlRoot: function() {},
	parse: function(response, options) {},
	clone: function() {},
	isNew: function() {},
	hasChanged: function([attribute]) {},
	changedAttributes: function([attributes]) {},
	previous: function(attribute) {},
	previousAttributes: function() {}
	*/
	
	
	//Module methods
	//someMethod: function (arg1, arg2) {}
	
	
});
Pulley.model.Foo.type = Pulley.model.Foo.prototype.type = 'Pulley.model.Foo';


//STATIC VARS
//Pulley.model.Foo.STATIC_VAR = 'myStaticVar';


//STATIC METHODS
//Pulley.model.Foo.staticMethod = function(){};


/*****
End Module: Pulley.model.Foo
*****/