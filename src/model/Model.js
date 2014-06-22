/*****
Module: Pulley.Model
Extends: Backbone.Model
Notes: 
*****/


registerNamespace('Pulley.model');
Pulley.Model = Backbone.Model.extend({
	
	
	/*defaults: {
		id: null, // integer
	},*/
	
	
	//Override Backbone.Model
	initialize: function (attributes, options) {
		this.type = this.__proto__.type;
	},
	
	clientUrl: null,
	clientUrlRoot: null,
	
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
	getType: function (shortFormat) {
		if (shortFormat) {
			var shortType = this.type.substring(this.type.lastIndexOf('.')+1);
			return shortType;
		}else{
			return this.type;
		}
	},
	
	clientUrl: function () {
		var base =
			_.result(this, 'clientUrlRoot') ||
			_.result(this.collection, 'clientUrl') ||
			urlError();
		if (this.isNew()) return base;
		//var url = base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id); //Removed because we don't want to remove a leading slash.
		var url = base + '/' + encodeURIComponent(this.id);
		if(__config && (__config.rootURL.indexOf('//') > -1)){
			url.replace(__config.rootURL, '');
		}
		return url;
	},
	
	//someMethod: function (arg1, arg2) {}
	
		
});
Pulley.Model.type = Pulley.Model.prototype.type = 'Pulley.Model';


//STATIC VARS
//Pulley.Model.STATIC_VAR = 'myStaticVar';


//STATIC METHODS
//Pulley.Model.staticMethod = function () {}


/*****
End Module: Pulley.Model
*****/