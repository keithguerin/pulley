/*****
Module: Pulley.view.controls.Guides
	Extends: Pulley.View, Backbone.View
Notes: 
*****/

registerNamespace('Pulley.view.controls');
Pulley.view.controls.Guides = Pulley.View.extend({
	
	
	//el
	//$el
	//attributes
	tagName: 'div',
	className: 'foo',
	//model: null, // Backbone.Model
	//template: Handlebars.compile('<div class="foo"></div>'),
	template: Handlebars.compile($("#guides-template").html()),
	//defaults: {id: null, // integer},
	//events: {'click .openbutton': 'open'},
	
	
	//Override Backbone.View methods
	initialize: function (options) { //Valid options: model, collection, el, id, className, tagName, attributes and events
		Pulley.View.prototype.initialize.apply(this, arguments); // Call super.
		
		//Define instance vars
		this.model = {
			numberOfGuidesToShow: parseInt(getURLVar('guides')),
		};
		
		//Set initial state
		this.render();
	},
	
	render: function () {
		//Pulley.View.prototype.render.apply(this, arguments); // Call super.
		if(!this.drawn){
			this.drawn = true;
			var html = this.template(this);
			this.setElement($(html)[0]); //Calls Pulley.View.setElement() to replace the reference and the element on stage.
			//this.$el.html(html); //Replace element's contents
			
			//Define children
			//this.children.widget = new Widget();
			//this.$('.widget-container').append(this.children.widget.el);
		}
		
		//Show guides for debugging
		if(this.model){
			if(this.model.numberOfGuidesToShow){
				this.$el.css({display:'block'});
				switch(this.model.numberOfGuidesToShow){
					case 1:
						this.$('.one-column').css({display:'block'}); break;
					case 2:
						this.$('.two-columns').css({display:'block'}); break;
					case 3:
						this.$('.three-columns').css({display:'block'}); break;
					case 4:
						this.$('.four-columns').css({display:'block'}); break;
					case 5:
						this.$('.five-columns').css({display:'block'}); break;
					case 6:
						this.$('.six-columns').css({display:'block'}); break;
					case 12:
						this.$('.twelve-columns').css({display:'block'}); break;
				}
			}else{
				this.$el.remove();
			}
		}
		
		return this; //Enable chained calls.
	},
	
	/*
	setElement: function (element) {},
	template: function ([data]) {},
	remove: function ([data]) {},
	*/
	
	
	//Override Pulley.View methods
	/*
	autoinitializeViews: function (containerElement) { //:Array of initialized Views
	reset: function (resetModel) { //(Boolean):void
	focus: function () { //():void
	setSize: function (w, h) { //(int, int):void
	isLocked: function () {
	lock: function (id) {
	unlock: function (id) {
	setState: function (stateArg, stateModel, useTransition, onComplete) { //(State or Number, Boolean, Function):void
	getStateIndex: function (state) { // (State):int
	getNextStateByOrder: function (excludeModalStates) {
	getLastState: function (excludeModalStates) {
	getStateByHash: function (hash) { // (String):State
	setStateByHash: function (hash, stateModel, useTransition, onComplete) { // (String, stateModel:Object, useTransition:Boolean, onComplete:Function):void
	*/
	
	/*setModel: function (model) {
		//Pulley.View.prototype.setModel.apply(this, arguments); // Call super.
		this.model = model;
		this.render();
		this.listenTo(this.model, 'change', this.render);
	},*/
	
	
	//Define module methods
	/*load: function(onSuccess, onError) {
		var _this = this;
		ajax({
			url: this.APIPath,
			method: 'get',
			//data: data,
			success: function(result, textStatus, jqxhr) {
				if(result.success){
				_this.setModel(result.data);
				if(onSuccess) onSuccess();
			},
			error: function(result){
				if(onError){
					onError(result);
				}else{
					console.error('An error occurred.');
				}
			}
		});
		
	},*/
	//someMethod: function (arg1, arg2) {}
	
	
});
Pulley.view.controls.Guides.type = Pulley.view.controls.Guides.prototype.type = 'Pulley.view.controls.Guides';


//STATIC VARS
//Pulley.view.controls.Guides.STATIC_VAR = 'myStaticVar';


//STATIC METHODS
//Pulley.view.controls.Guides.staticMethod = function(){};


/*****
End Module: Pulley.view.controls.Guides
*****/